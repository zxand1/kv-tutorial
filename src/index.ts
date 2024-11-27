export interface Env {
  SPACE: KVNamespace;
}

interface VagaData {
	vaga: number;
  placa: string;
  foto: string;
}

export default {
  async fetch(request, env, ctx): Promise<Response> {
    try {
      const url = new URL(request.url);
      const vagaId = url.pathname.split('/').pop();
      if (!vagaId) {
        return new Response("Vaga ID is required", { status: 400 });
      }
      const body : VagaData = await request.json();
      const valueToStore = {
        vaga: body.vaga,
        placa: body.placa,
        foto: body.foto
      };
      await env.SPACE.put(vagaId, JSON.stringify(valueToStore));
      const value = await env.SPACE.get(vagaId);
      if (value === null) {
        return new Response("Vaga not found", { status: 404 });
      }
      const parsedValue = JSON.parse(value);
      return new Response(JSON.stringify(parsedValue), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (err) {
      console.error(`KV returned error: ${err}`);
      return new Response(err as string, { status: 500 });
    }
  },
} satisfies ExportedHandler<Env>;
