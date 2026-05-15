<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class DemoSeeder
{
    public function __construct(private $db) {}

    public function run(): void
    {
        $this->seed_astrologers();
        $this->seed_pujas();
        $this->seed_articles();
    }

    private function seed_astrologers(): void
    {
        $rows = [
            [
                'slug' => 'pandit-suresh-iyer',
                'name' => 'Pandit Suresh Iyer',
                'bio'  => '25 years of Vedic astrology and Tamil jothisyam. Specializes in career, marriage, and remedial pujas.',
                'photo_url' => 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400',
                'specialties' => 'vedic,jothisyam,kp',
                'languages' => 'english,tamil,sanskrit',
                'experience_years' => 25,
                'rating' => 4.9, 'reviews_count' => 1248,
                'price_per_session_paise' => 99900, 'session_minutes' => 30,
            ],
            [
                'slug' => 'dr-meera-shastri',
                'name' => 'Dr. Meera Shastri',
                'bio'  => 'PhD in Vedic Astrology. Numerology + KP system specialist. Calm, evidence-led readings.',
                'photo_url' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
                'specialties' => 'numerology,kp,vedic',
                'languages' => 'english,hindi',
                'experience_years' => 18,
                'rating' => 4.8, 'reviews_count' => 821,
                'price_per_session_paise' => 79900, 'session_minutes' => 30,
            ],
            [
                'slug' => 'acharya-rajesh-kumar',
                'name' => 'Acharya Rajesh Kumar',
                'bio'  => 'Vasthu shastra and remedial pujas. Helped 5,000+ families align their homes and businesses.',
                'photo_url' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
                'specialties' => 'vasthu,vedic',
                'languages' => 'english,hindi,bhojpuri',
                'experience_years' => 22,
                'rating' => 4.95, 'reviews_count' => 510,
                'price_per_session_paise' => 149900, 'session_minutes' => 45,
            ],
        ];
        foreach ($rows as $r) {
            $existing = $this->db->get_where('astrologers', ['slug' => $r['slug']])->row_array();
            if ($existing) continue;
            $r['created_at'] = date('Y-m-d H:i:s');
            $this->db->insert('astrologers', $r);
        }
    }

    private function seed_pujas(): void
    {
        $rows = [
            [
                'slug' => 'kashi-rudrabhishek',
                'name' => 'Kashi Vishwanath Rudrabhishek',
                'deity' => 'Lord Shiva',
                'temple' => 'Kashi Vishwanath Temple',
                'city' => 'Varanasi',
                'description' => 'Powerful Rudrabhishek puja performed at the most sacred Shiva temple. Live stream + prasad delivery.',
                'image_url' => 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800',
                'price_paise' => 251100, 'duration_minutes' => 90,
                'features' => json_encode(['Live HD stream', 'Sankalpam in your name', 'Prasad shipped to your home', 'Pandit consultation included']),
                'featured' => 1,
            ],
            [
                'slug' => 'tirupati-balaji-archana',
                'name' => 'Tirupati Balaji Archana',
                'deity' => 'Lord Venkateswara',
                'temple' => 'Sri Venkateswara Temple',
                'city' => 'Tirumala',
                'description' => 'Daily archana in your name at the holy abode of Lord Balaji.',
                'image_url' => 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800',
                'price_paise' => 51100, 'duration_minutes' => 30,
                'features' => json_encode(['Sankalpam', 'Recorded video', 'Prasad delivery']),
                'featured' => 1,
            ],
            [
                'slug' => 'mahalakshmi-puja',
                'name' => 'Mahalakshmi Puja for Wealth',
                'deity' => 'Goddess Lakshmi',
                'temple' => 'Mahalakshmi Temple',
                'city' => 'Mumbai',
                'description' => 'Friday Mahalakshmi puja for prosperity and abundance.',
                'image_url' => 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800',
                'price_paise' => 151100, 'duration_minutes' => 60,
                'features' => json_encode(['Live stream', 'Sankalpam', 'Yantra + prasad delivery']),
                'featured' => 0,
            ],
        ];
        foreach ($rows as $r) {
            $existing = $this->db->get_where('pujas', ['slug' => $r['slug']])->row_array();
            if ($existing) continue;
            $r['created_at'] = date('Y-m-d H:i:s');
            $this->db->insert('pujas', $r);
        }
    }

    private function seed_articles(): void
    {
        $rows = [
            [
                'slug' => 'how-to-read-your-vedic-birth-chart',
                'title' => 'How to read your Vedic birth chart — a beginner\'s guide',
                'excerpt' => 'Understand your rasi, navamsa, and dasha periods in plain English.',
                'body' => '<p>Your Vedic birth chart, or kundli, is a snapshot of the sky at the moment you were born...</p>',
                'category' => 'astrology',
                'tags' => 'kundli,vedic,beginner',
                'author' => 'Mileora Editorial',
                'status' => 'published',
                'published_at' => date('Y-m-d H:i:s'),
            ],
        ];
        foreach ($rows as $r) {
            $existing = $this->db->get_where('articles', ['slug' => $r['slug']])->row_array();
            if ($existing) continue;
            $r['created_at'] = date('Y-m-d H:i:s');
            $this->db->insert('articles', $r);
        }
    }
}
