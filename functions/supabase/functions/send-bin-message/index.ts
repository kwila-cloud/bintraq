// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Twilio from "npm:twilio";

export type Bin = {
  uuid: string
  date: Date
  picker: string
  block: string
  size: string
  id: string
  isPending: boolean
  messageUuid: string | null

  [key: string]: any
}

console.info('server started');
Deno.serve(async (req) => {
  const message = await req.json();
  const record = message.record;
  const oldRecord = message.old_record;

  let messageSent = false;
  let success: boolean | null = null;
  if (record.isPending == false && oldRecord.isPending == true && record.messageUuid == null) {
    success = await sendMessage(record);
  }

  return new Response(JSON.stringify({ messageSent, success }), {
    headers: {
      'Content-Type': 'application/json',
      'Connection': 'keep-alive'
    }
  });
});

const sendMessage = async (bin: Bin) => {
  const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID") ?? "NO_SID";
  const authToken = Deno.env.get("TWILIO_AUTH_TOKEN") ?? "NO_TOKEN";
  const from = Deno.env.get("TWILIO_PHONE_NUMBER") ?? "";
  const client = Twilio(accountSid, authToken);
  // TODO: calculate from supabase
  const dayCount = 0;
  // TODO: calculate from supabase
  const weekCount = 0;
  // TODO: fix date format
  const body = `
ID del Caja: ${bin.id}
Fecha: ${new Date(bin.date).toDateString()}
Recogedor: ${bin.picker}
Bloque: ${bin.block}
Tamaño del Caja: ${bin.size} bushel
Cantidad Diaria de Cajas: ${dayCount}
Cantidad Semanal de Cajas: ${weekCount}
  `;
  // TODO: get phone number by picker name
  const to = Deno.env.get("TWILIO_TEMP_TO") ?? "";

  try {
    const message = await client.messages.create({ body, from, to });
    console.log("sent successfully:", message.sid);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}
