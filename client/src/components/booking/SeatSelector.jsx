/**
 * @file SeatSelector.jsx
 * @description Cinema Seat Matrix & Smart Group Booking Assistant Component
 * 
 * ALGORITHM & INTERVIEW EXPLANATION:
 * 1. Seat Grid Generation Algorithm:
 *    - Rows: Array of 10 row labels ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
 *    - Columns: Array of 12 column numbers [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
 *    - Matrix Generation: 10 x 12 = 120 seat objects.
 *    - Unique Identifier: Each seat ID is calculated as `${row}${col}` (e.g. "A1", "B12", "J6").
 * 
 * 2. Smart Group Booking Assistant (Scoring System):
 *    - Finds contiguous available seat blocks for requested ticket count (1 to 8).
 *    - Evaluates distance from horizontal screen center (Column 6.5) and optimal eye-level rows (E, F, G).
 *    - Applies a -35 penalty for leaving isolated 1-seat gaps.
 *    - Provides 1-click auto-selection of recommended seat combinations.
 */

import React, { useState } from 'react';
import './SeatSelector.css';

const SeatSelector = ({
    bookedSeats = [],
    selectedSeats = [],
    onSeatClick,
    onSelectRecommendedSeats,
    ticketPrice = 250,
    maxSeats = 8
}) => {
    const [bookingMode, setBookingMode] = useState('manual'); // 'manual' or 'smart'
    const [requestedTicketCount, setRequestedTicketCount] = useState(4);
    const [activeRecId, setActiveRecId] = useState(null);

    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const columns = Array.from({ length: 12 }, (_, i) => i + 1);

    // Client-side fallback scoring algorithm if offline/demo
    const generateLocalRecommendations = (count) => {
        const bookedSet = new Set(bookedSeats);
        const screenCenterCol = 6.5;
        const rowWeights = { 'A': 15, 'B': 20, 'C': 30, 'D': 45, 'E': 60, 'F': 65, 'G': 60, 'H': 45, 'I': 30, 'J': 25 };
        const candidates = [];

        rows.forEach((row) => {
            const rowWeight = rowWeights[row] || 30;
            for (let startCol = 1; startCol <= 12 - count + 1; startCol++) {
                const endCol = startCol + count - 1;
                let isFree = true;
                const group = [];
                for (let c = startCol; c <= endCol; c++) {
                    const id = `${row}${c}`;
                    if (bookedSet.has(id)) {
                        isFree = false;
                        break;
                    }
                    group.push(id);
                }

                if (isFree) {
                    const mid = (startCol + endCol) / 2;
                    const colOffset = Math.abs(mid - screenCenterCol);
                    const centerScore = Math.max(0, 100 - (colOffset * 16));

                    let penalty = 0;
                    if (startCol === 2 || (startCol > 2 && bookedSet.has(`${row}${startCol - 2}`) && !bookedSet.has(`${row}${startCol - 1}`))) {
                        penalty += 35;
                    }
                    if (endCol === 11 || (endCol < 11 && bookedSet.has(`${row}${endCol + 2}`) && !bookedSet.has(`${row}${endCol + 1}`))) {
                        penalty += 35;
                    }

                    const score = Math.round(centerScore + rowWeight - penalty);
                    candidates.push({ row, seats: group, score, totalPrice: count * ticketPrice });
                }
            }
        });

        candidates.sort((a, b) => b.score - a.score);

        const results = [];
        const usedRows = new Set();
        for (const c of candidates) {
            if (results.length >= 3) break;
            if (!usedRows.has(c.row) || candidates.length <= 3) {
                results.push({
                    id: `rec-${results.length + 1}`,
                    row: c.row,
                    seats: c.seats,
                    seatsText: c.seats.join(', '),
                    score: c.score,
                    isBestChoice: results.length === 0,
                    totalPrice: c.totalPrice
                });
                usedRows.add(c.row);
            }
        }
        return results;
    };

    const currentRecommendations = generateLocalRecommendations(requestedTicketCount);

    const handleSelectCard = (rec) => {
        setActiveRecId(rec.id);
        if (onSelectRecommendedSeats) {
            onSelectRecommendedSeats(rec.seats);
        }
    };

    return (
        <div className="seat-selector-container">
            {/* Booking Mode Switcher */}
            <div className="booking-mode-bar">
                <div className="mode-toggle-group">
                    <button
                        className={`mode-btn ${bookingMode === 'manual' ? 'active' : ''}`}
                        onClick={() => setBookingMode('manual')}
                    >
                        🖐️ Manual Selection
                    </button>
                    <button
                        className={`mode-btn ${bookingMode === 'smart' ? 'active' : ''}`}
                        onClick={() => setBookingMode('smart')}
                    >
                        ✨ Smart Seat Assistant
                    </button>
                </div>
            </div>

            {/* Smart Seat Recommendation Panel */}
            {bookingMode === 'smart' && (
                <div className="smart-assistant-panel">
                    <div className="assistant-header">
                        <div className="assistant-title-box">
                            <span className="assistant-icon">✨</span>
                            <div>
                                <h3>Recommended Seats for You</h3>
                                <p>Optimal contiguous seats near the center screen with zero split seating</p>
                            </div>
                        </div>

                        {/* Ticket Count Selector */}
                        <div className="ticket-count-selector">
                            <span className="count-label">How many tickets?</span>
                            <div className="count-pills">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                                    <button
                                        key={num}
                                        className={`count-pill ${requestedTicketCount === num ? 'active' : ''}`}
                                        onClick={() => {
                                            setRequestedTicketCount(num);
                                            setActiveRecId(null);
                                        }}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Recommendation Cards Row */}
                    <div className="recommendations-grid">
                        {currentRecommendations.length > 0 ? (
                            currentRecommendations.map((rec) => (
                                <div
                                    key={rec.id}
                                    className={`recommendation-card ${rec.isBestChoice ? 'best-choice' : ''} ${activeRecId === rec.id ? 'selected' : ''}`}
                                    onClick={() => handleSelectCard(rec)}
                                >
                                    {rec.isBestChoice && <span className="best-badge">🏆 Best Choice</span>}
                                    <div className="rec-card-body">
                                        <div className="rec-row-info">
                                            <span className="rec-row-tag">Row {rec.row}</span>
                                            <span className="rec-score-pill">Match Score: {rec.score}</span>
                                        </div>
                                        <h4 className="rec-seats-title">{rec.seatsText}</h4>
                                        <div className="rec-card-footer">
                                            <span className="rec-price">₹{rec.totalPrice} ({requestedTicketCount} Tickets)</span>
                                            <button className="btn-select-rec">
                                                {activeRecId === rec.id ? 'Selected ✓' : 'Select Seats ➔'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-recommendations">
                                ⚠️ No contiguous {requestedTicketCount} available seats found in a single row. Try selecting fewer seats or manual selection.
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Curved Cinema Screen Indicator */}
            <div className="screen-wrapper">
                <div className="curved-screen"></div>
                <span className="screen-label">🎬 SCREEN THIS WAY</span>
            </div>

            {/* Seat Grid Matrix */}
            <div className="seat-grid">
                {rows.map((row) => (
                    <div key={row} className="seat-row">
                        {/* Row Label (Left) */}
                        <span className="row-label">{row}</span>

                        {/* Row Seats */}
                        <div className="row-seats">
                            {columns.map((col) => {
                                const seatId = `${row}${col}`;
                                const isBooked = bookedSeats.includes(seatId);
                                const isSelected = selectedSeats.includes(seatId);

                                let statusClass = 'available';
                                if (isBooked) statusClass = 'booked';
                                else if (isSelected) statusClass = 'selected';

                                return (
                                    <button
                                        key={seatId}
                                        className={`seat-btn ${statusClass}`}
                                        onClick={() => !isBooked && onSeatClick(seatId)}
                                        disabled={isBooked}
                                        title={isBooked ? `Seat ${seatId} (Booked)` : `Seat ${seatId}`}
                                    >
                                        {col}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Row Label (Right) */}
                        <span className="row-label">{row}</span>
                    </div>
                ))}
            </div>

            {/* Seat Status Color Legend */}
            <div className="seat-legend">
                <div className="legend-item">
                    <span className="legend-box available"></span>
                    <span>Available</span>
                </div>
                <div className="legend-item">
                    <span className="legend-box selected"></span>
                    <span>Selected</span>
                </div>
                <div className="legend-item">
                    <span className="legend-box booked"></span>
                    <span>Booked</span>
                </div>
            </div>
        </div>
    );
};

export default SeatSelector;
