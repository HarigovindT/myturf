const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") || "";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { customerName, customerPhone, customerEmail, sport, date, startTime, endTime, duration, totalPrice } = body;

    if (!ADMIN_EMAIL) {
      console.log("ADMIN_EMAIL not set, skipping notification");
      return new Response(
        JSON.stringify({ message: "Admin email not configured" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    // Log the booking details for now
    console.log("New booking notification:", {
      to: ADMIN_EMAIL,
      customerName,
      customerPhone,
      customerEmail,
      sport,
      date,
      startTime,
      endTime,
      duration,
      totalPrice,
    });

    // For now, just log it. When email infrastructure is set up,
    // this can be replaced with actual email sending.
    return new Response(
      JSON.stringify({ 
        message: "Notification logged",
        details: {
          customerName,
          customerPhone,
          sport,
          date,
          time: `${startTime} - ${endTime}`,
          duration: `${duration} hours`,
          totalPrice: `₹${totalPrice}`,
        }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Error processing notification:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process notification" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
