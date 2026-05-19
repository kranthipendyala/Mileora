<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Generate a URL-safe slug from a string.
 *   slugify("Pandit Suresh Iyer!") → "pandit-suresh-iyer"
 */
if (!function_exists('slugify')) {
    function slugify(string $text): string
    {
        $text = strtolower(trim($text));
        $text = (string) preg_replace('/[^a-z0-9]+/', '-', $text);
        return trim($text, '-');
    }
}

/**
 * Generate a slug guaranteed unique within a table.
 * Appends -2, -3, etc. as needed.
 *
 *   unique_slug("Pandit Suresh", "astrologers")
 *
 * @param int|null $ignore_id   Pass when updating, to ignore the current row.
 */
if (!function_exists('unique_slug')) {
    function unique_slug(string $source, string $table, string $column = 'slug', ?int $ignore_id = null): string
    {
        $CI =& get_instance();
        $base = slugify($source);
        if ($base === '') $base = 'item';

        $slug = $base;
        $n = 2;
        while (true) {
            $CI->db->where($column, $slug);
            if ($ignore_id !== null) $CI->db->where('id !=', $ignore_id);
            if ((int) $CI->db->count_all_results($table) === 0) break;
            $slug = $base . '-' . $n++;
        }
        return $slug;
    }
}
