/**
 * @file moviesData.js
 * @description Central dataset of 25+ Movies, Streams, Events, Plays, and Sports for MovieVerse Pro
 */

export const INITIAL_MOVIES = [
    // === MOVIES (Theatrical Releases) ===
    {
        _id: '1',
        title: 'Oppenheimer',
        category: 'Movies',
        description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.',
        language: 'English',
        genre: ['Biography', 'Drama', 'History'],
        duration: 180,
        rating: '8.9',
        votes: '210K',
        formats: ['IMAX 70MM', 'IMAX 3D', '2D'],
        poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80',
        releaseDate: '2023-07-21'
    },
    {
        _id: '2',
        title: 'Interstellar',
        category: 'Movies',
        description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity survival as Earth perishes.',
        language: 'English',
        genre: ['Sci-Fi', 'Adventure', 'Drama'],
        duration: 169,
        rating: '8.6',
        votes: '190K',
        formats: ['IMAX 3D', '2D'],
        poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
        releaseDate: '2014-11-07'
    },
    {
        _id: '3',
        title: 'Dune: Part Two',
        category: 'Movies',
        description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family on Arrakis.',
        language: 'Hindi',
        genre: ['Sci-Fi', 'Action', 'Adventure'],
        duration: 166,
        rating: '8.8',
        votes: '145K',
        formats: ['IMAX 3D', '4DX', '2D'],
        poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
        releaseDate: '2024-03-01'
    },
    {
        _id: '4',
        title: 'The Dark Knight',
        category: 'Movies',
        description: 'When the menace known as the Joker wreaks havoc and chaos on Gotham, Batman must accept one of the greatest psychological tests.',
        language: 'English',
        genre: ['Action', 'Crime', 'Drama'],
        duration: 152,
        rating: '9.0',
        votes: '280K',
        formats: ['IMAX 2D', '2D'],
        poster: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=600&q=80',
        releaseDate: '2008-07-18'
    },
    {
        _id: '7',
        title: 'Jawan',
        category: 'Movies',
        description: 'A high-octane action thriller highlighting the emotional journey of Vikram Rathore and Azad set to rectify systemic wrongs in society.',
        language: 'Hindi',
        genre: ['Action', 'Thriller', 'Drama'],
        duration: 169,
        rating: '8.4',
        votes: '175K',
        formats: ['IMAX 2D', '2D', '4DX'],
        poster: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
        releaseDate: '2023-09-07'
    },
    {
        _id: '9',
        title: 'Pushpa 2: The Rule',
        category: 'Movies',
        description: 'The clash continues between Pushpa Raj and SP Bhanwar Singh Shekhawat in this explosive action drama sequel directed by Sukumar.',
        language: 'Telugu',
        genre: ['Action', 'Crime', 'Drama'],
        duration: 175,
        rating: '8.7',
        votes: '180K',
        formats: ['2D', '4DX'],
        poster: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&w=600&q=80',
        releaseDate: '2024-12-05'
    },
    {
        _id: '14',
        title: 'Stree 2',
        category: 'Movies',
        description: 'Chanderi is haunted once again by a new headless malevolent spirit named Sarkata. Vicky, Stree, and their gang must rise to save Chanderi.',
        language: 'Hindi',
        genre: ['Comedy', 'Horror'],
        duration: 147,
        rating: '8.3',
        votes: '140K',
        formats: ['2D'],
        poster: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=600&q=80',
        releaseDate: '2024-08-15'
    },

    // === STREAM (OTT Exclusives) ===
    {
        _id: '5',
        title: 'Kantara: A Legend',
        category: 'Stream',
        description: 'When greed paves the way for betrayal, a human-versus-nature conflict leads to a sacred tribal heritage awakening.',
        language: 'Telugu',
        genre: ['Action', 'Drama', 'Thriller'],
        duration: 148,
        rating: '8.7',
        votes: '165K',
        formats: ['OTT 4K Ultra HD', '2D'],
        poster: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?auto=format&fit=crop&w=600&q=80',
        releaseDate: '2022-09-30'
    },
    {
        _id: '6',
        title: 'Avatar: The Way of Water',
        category: 'Stream',
        description: 'Jake Sully lives with his newfound family formed on Pandora. Once a familiar threat returns, Jake must protect them.',
        language: 'English',
        genre: ['Sci-Fi', 'Action', 'Adventure'],
        duration: 192,
        rating: '8.5',
        votes: '230K',
        formats: ['OTT 4K', 'Dolby Atmos'],
        poster: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
        releaseDate: '2022-12-16'
    },
    {
        _id: '11',
        title: 'Animal',
        category: 'Stream',
        description: 'A father-son relationship carved out of dark obsession and extreme violence leads Ranvijay Singh down a path of retribution.',
        language: 'Hindi',
        genre: ['Action', 'Crime', 'Drama'],
        duration: 201,
        rating: '8.1',
        votes: '150K',
        formats: ['OTT 4K HD'],
        poster: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80',
        releaseDate: '2023-12-01'
    },
    {
        _id: '19',
        title: 'Manjummel Boys',
        category: 'Stream',
        description: 'A group of friends embark on a daring rescue mission to save their friend who fell into the Guna Caves.',
        language: 'Malayalam',
        genre: ['Survival', 'Thriller', 'Drama'],
        duration: 135,
        rating: '8.6',
        votes: '160K',
        formats: ['OTT 4K HD'],
        poster: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
        releaseDate: '2024-02-22'
    },

    // === EVENTS (Live Concerts & Comedy Shows) ===
    {
        _id: 'e1',
        title: 'A.R. Rahman Live Symphony Concert',
        category: 'Events',
        description: 'Experience Oscar-winner A.R. Rahman live in concert with an 80-piece orchestra performing iconic hit songs.',
        language: 'Hindi',
        genre: ['Music', 'Concert'],
        duration: 180,
        rating: '9.5',
        votes: '85K',
        formats: ['VIP Arena', 'Live Stage'],
        poster: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
        releaseDate: '2026-09-15'
    },
    {
        _id: 'e2',
        title: 'Kapil Sharma Unfiltered Standup Tour',
        category: 'Events',
        description: 'India comedy king Kapil Sharma returns live with brand new hilarious observational humor and celebrity crowd work.',
        language: 'Hindi',
        genre: ['Comedy', 'Live Show'],
        duration: 120,
        rating: '9.2',
        votes: '62K',
        formats: ['Front Row', 'Balcony'],
        poster: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
        releaseDate: '2026-09-20'
    },

    // === PLAYS (Theatre & Musical Drama) ===
    {
        _id: 'p1',
        title: 'Mughal-e-Azam: Grand Musical Play',
        category: 'Plays',
        description: 'Feroz Abbas Khan epic theatrical adaptation of the legendary romance between Prince Salim and Anarkali with live singing.',
        language: 'Hindi',
        genre: ['Drama', 'Musical', 'History'],
        duration: 160,
        rating: '9.6',
        votes: '40K',
        formats: ['Grand Auditorium', 'Royal Box'],
        poster: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&w=600&q=80',
        releaseDate: '2026-10-01'
    },
    {
        _id: 'p2',
        title: 'Shakespeare Hamlet: Modern Stage Adaptation',
        category: 'Plays',
        description: 'A contemporary theatrical production of Shakespeare masterpiece Hamlet featuring intense drama and original score.',
        language: 'English',
        genre: ['Drama', 'Tragedy'],
        duration: 140,
        rating: '9.0',
        votes: '25K',
        formats: ['Theatre Stage'],
        poster: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=600&q=80',
        releaseDate: '2026-10-10'
    },

    // === SPORTS (Live Stadium Matches) ===
    {
        _id: 's1',
        title: 'IPL 2026: Mumbai Indians vs Chennai Super Kings',
        category: 'Sports',
        description: 'The ultimate cricket rivalry! Catch the electrifying IPL clash live from Wankhede Stadium.',
        language: 'English',
        genre: ['Cricket', 'Sports'],
        duration: 210,
        rating: '9.8',
        votes: '320K',
        formats: ['Stadium Pass', 'VIP Lounge'],
        poster: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=600&q=80',
        releaseDate: '2026-04-12'
    },
    {
        _id: 's2',
        title: 'ISL Final: Bengaluru FC vs Mohun Bagan',
        category: 'Sports',
        description: 'Witness Indian Super League high-stakes football championship final battle live from Sree Kanteerava Stadium.',
        language: 'English',
        genre: ['Football', 'Sports'],
        duration: 120,
        rating: '9.1',
        votes: '45K',
        formats: ['East Stand', 'West VIP'],
        poster: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80',
        releaseDate: '2026-05-18'
    }
];
