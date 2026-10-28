
require("dotenv").config();

const supabase = require("./supabaseClient");

async function testSupabaseConnection() {
    const { data, error } = await supabase
        .from("kitaro_waste_records")
        .select("id")
        .limit(1);

    if (error) {
        console.error("Supabase connection test failed:");
        console.error(error.message);
        process.exitCode = 1;
        return;
    }

    console.log("Supabase database request succeeded.");
    console.log(`Rows returned: ${data.length}`);
}

testSupabaseConnection().catch((error) => {
    console.error("Unexpected error:", error.message);
    process.exitCode = 1;
});
