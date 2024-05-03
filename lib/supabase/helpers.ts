"use server";
import { cookies } from "next/headers";
import { createClient } from "./server";

export async function getUsername(id: string) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    try {
        let { data, error } = await supabase
            .from("users")
            .select("full_name")
            .eq("id", id)
            .single();

        if (error) {
            console.error("Error fetching data from status table:", error);
            throw error;
        }

        return data?.full_name;
    } catch (error) {
        console.error("Error fetching data from status table:", error);
        return null;
    }
}

export async function addSelfMoodRecord(mood: string, mood_text: string) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const moods = [
        "Elated",
        "Joyful",
        "Serene",
        "Happy",
        "Neutral",
        "Sad",
        "Lonely",
        "Scared",
        "Depressed",
    ];

    const user_id = user.id;
    try {
        let { data, error } = await supabase.from("mood_swings").insert([
            {
                ratee: user_id,
                rater: user_id,
                weight: 1,
                mood_score: moods.length - moods.indexOf(mood) + 1,
                mood: mood,
                mood_text: mood_text,
            },
        ]);

        if (error) {
            console.error("Error inserting data into mood table:", error);
            throw error;
        }

        return data;
    } catch (error) {
        console.error("Error inserting data into mood table:", error);
        return null;
    }
}
