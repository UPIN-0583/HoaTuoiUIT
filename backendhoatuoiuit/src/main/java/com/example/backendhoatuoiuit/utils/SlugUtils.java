package com.example.backendhoatuoiuit.utils;

import java.text.Normalizer;

public class SlugUtils {

    public static String createSlug(String input) {
        if (input == null) return null;

        String slug = input.toLowerCase();
        slug = Normalizer.normalize(slug, Normalizer.Form.NFD);
        slug = slug.replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
        slug = slug.replaceAll("[^a-z0-9\\s-]", "");
        slug = slug.trim().replaceAll("\\s+", "-");

        return slug;
    }
}
