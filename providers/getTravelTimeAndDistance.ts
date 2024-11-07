import { Coordinate } from "@/services/Coordinate";

// export async function getTravelTimeAndDistance({
//   origins,
//   destinations,
// }: {
//   origins: Coordinate;
//   destinations: Coordinate;
// }) {
//   const apiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY_MATRIX;

//   console.log({ origins });

//   const originsString = `${origins.latitude},${origins.longitude}`;
//   const destinationsString = `${destinations.latitude},${destinations.longitude}`;

//   const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originsString}&destinations=${destinationsString}&key=${apiKey}`;

//   console.log(url);

//   try {
//     const response = await fetch(url);
//     const data = await response.json();

//     if (data.status === "OK" && data.rows && data.rows[0].elements[0]) {
//       const element = data.rows[0].elements[0];

//       if (element.status === "OK") {
//         const distance = element.distance?.text;
//         const duration = element.duration?.text;

//         if (distance && duration) {
//           return { distance, duration };
//         } else {
//           throw new Error("Distância ou duração não encontradas na resposta");
//         }
//       } else {
//         throw new Error(`Erro nos elementos da resposta: ${element.status}`);
//       }
//     } else {
//       throw new Error(`Erro na resposta da API: ${data.status}`);
//     }
//   } catch (error) {
//     throw new Error("Erro ao calcular distância e tempo");
//   }
// }

export async function getTravelTimeAndDistance({
  origins,
  destinations,
}: {
  origins: Coordinate;
  destinations: Coordinate;
}) {
  const url = `http://router.project-osrm.org/route/v1/driving/${origins.longitude},${origins.latitude};${destinations.longitude},${destinations.latitude}?overview=false`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      const distance = (route.distance / 1000).toFixed(2);
      const duration = (route.duration / 60).toFixed(2);
      return { distance: `${distance} km`, duration: `${duration} min` };
    } else {
      throw new Error("Rota não encontrada");
    }
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    throw new Error("Erro ao calcular distância e tempo");
  }
}
