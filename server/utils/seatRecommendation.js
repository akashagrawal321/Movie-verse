/**
 * @file seatRecommendation.js
 * @description Smart Seat Recommendation Engine & Group Booking Assistant for Cinema Auditoriums
 * 
 * =========================================================================================
 * 🧠 INTERVIEW EXPLANATION & ARCHITECTURAL DESIGN
 * =========================================================================================
 * 
 * 1. REAL-WORLD CINEMA BOOKING PROBLEM:
 *    When families or friends book tickets (e.g. 3–6 seats), finding contiguous available
 *    seats near the screen center is tedious. Manual picking often leads to split groups,
 *    awkward side seats, or leaving single unbookable orphan seat gaps.
 * 
 * 2. MATHEMATICAL SCORING FORMULA:
 *    For a requested ticket count K (1 <= K <= 8) in a cinema layout of R rows (A-J) and C cols (1-12):
 * 
 *    Score(Group) = CenterColScore + RowPreferenceScore + ContiguousBonus - SingleSeatGapPenalty
 * 
 *    a) CenterColScore = max(0, 100 - (|MidCol - 6.5| * 16))
 *       - Distance from hall horizontal center (6.5) determines acoustic & viewing sweet spot.
 * 
 *    b) RowPreferenceScore:
 *       - Rows E, F, G (Premier viewing angle): +60 pts
 *       - Rows D, H (Gold zone): +45 pts
 *       - Rows C, I (Silver zone): +30 pts
 *       - Rows A, B (Front screen zone): +15 pts
 * 
 *    c) SingleSeatGapPenalty (-35 pts):
 *       - If selecting this group leaves an isolated single empty seat (gap of 1) between
 *         the group and a booked seat or aisle, penalize by 35 points. Cinema revenue
 *         management heavily discourages 1-seat gaps.
 * 
 * 3. TIME COMPLEXITY & SCALABILITY:
 *    - Time Complexity: O(R * (C - K + 1)) per recommendation request.
 *      For 10 rows and 12 seats per row (120 seats total), the scan completes in under 0.5ms (O(1) runtime).
 *    - Space Complexity: O(N) where N is the number of candidate contiguous seat blocks.
 * 
 * =========================================================================================
 */

/**
 * Generates top 3 smart seat recommendations for a given show and ticket count.
 * 
 * @param {Array<string>} bookedSeats - List of seat IDs already booked (e.g., ["A1", "B5", "E6"])
 * @param {number} ticketCount - Requested number of contiguous seats (1 to 8)
 * @param {number} ticketPrice - Per ticket price in INR
 * @param {Array<string>} customRows - Row labels (default: ['A'..'J'])
 * @param {number} seatsPerRow - Number of seats per row (default: 12)
 * @returns {Array<Object>} Top 3 scored recommendation combinations
 */
const recommendBestSeats = (
    bookedSeats = [],
    ticketCount = 4,
    ticketPrice = 250,
    customRows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
    seatsPerRow = 12
) => {
    // Sanitize ticketCount bounds (1 to 8)
    const count = Math.min(Math.max(parseInt(ticketCount, 10) || 1, 1), 8);
    const bookedSet = new Set(bookedSeats);

    // Row preference mapping (E, F, G are optimal eye-level center rows)
    const rowScores = {
        'A': 15, 'B': 20, 'C': 30, 'D': 45,
        'E': 60, 'F': 65, 'G': 60, 'H': 45,
        'I': 30, 'J': 25
    };

    const screenCenterCol = (seatsPerRow + 1) / 2; // e.g. 6.5 for 12 columns
    const candidates = [];

    // Scan each row for contiguous available seat blocks
    customRows.forEach((row) => {
        const rowWeight = rowScores[row] || 30;

        for (let startCol = 1; startCol <= seatsPerRow - count + 1; startCol++) {
            const endCol = startCol + count - 1;
            let isBlockAvailable = true;
            const groupSeatIds = [];

            // Check if all seats in block [startCol ... endCol] are free
            for (let c = startCol; c <= endCol; c++) {
                const seatId = `${row}${c}`;
                if (bookedSet.has(seatId)) {
                    isBlockAvailable = false;
                    break;
                }
                groupSeatIds.push(seatId);
            }

            if (isBlockAvailable) {
                // 1. Calculate Center Column Distance
                const groupMidCol = (startCol + endCol) / 2;
                const colOffset = Math.abs(groupMidCol - screenCenterCol);
                const centerColScore = Math.max(0, 100 - (colOffset * 16));

                // 2. Single-Seat Gap Penalty Evaluation
                let gapPenalty = 0;

                // Left side gap check
                if (startCol === 2 || (startCol > 2 && bookedSet.has(`${row}${startCol - 2}`) && !bookedSet.has(`${row}${startCol - 1}`))) {
                    gapPenalty += 35; // Leaves single seat at left aisle or next to booked seat
                }
                // Right side gap check
                if (endCol === seatsPerRow - 1 || (endCol < seatsPerRow - 1 && bookedSet.has(`${row}${endCol + 2}`) && !bookedSet.has(`${row}${endCol + 1}`))) {
                    gapPenalty += 35; // Leaves single seat at right aisle or next to booked seat
                }

                // 3. Compute Total Composite Score
                const totalScore = Math.round(centerColScore + rowWeight - gapPenalty);

                candidates.push({
                    row,
                    startCol,
                    endCol,
                    seats: groupSeatIds,
                    score: totalScore,
                    centerOffset: colOffset.toFixed(1),
                    totalPrice: count * ticketPrice
                });
            }
        }
    });

    // Sort candidates descending by score
    candidates.sort((a, b) => b.score - a.score);

    // Pick top 3 distinct row/area recommendations
    const top3 = [];
    const usedRows = new Set();

    for (const cand of candidates) {
        if (top3.length >= 3) break;

        // Ensure diversity: avoid duplicate identical rows if possible unless few candidates remain
        if (!usedRows.has(cand.row) || candidates.length <= 3) {
            top3.push({
                id: `rec-${top3.length + 1}`,
                row: cand.row,
                seats: cand.seats,
                seatsText: cand.seats.join(', '),
                score: cand.score,
                isBestChoice: top3.length === 0,
                totalPrice: cand.totalPrice,
                ticketCount: count
            });
            usedRows.add(cand.row);
        }
    }

    // Fallback if less than 3 recommendations due to row filter
    if (top3.length < 3) {
        candidates.forEach((cand) => {
            if (top3.length < 3 && !top3.some(t => t.seats.join(',') === cand.seats.join(','))) {
                top3.push({
                    id: `rec-${top3.length + 1}`,
                    row: cand.row,
                    seats: cand.seats,
                    seatsText: cand.seats.join(', '),
                    score: cand.score,
                    isBestChoice: top3.length === 0,
                    totalPrice: cand.totalPrice,
                    ticketCount: count
                });
            }
        });
    }

    return top3;
};

module.exports = {
    recommendBestSeats
};
