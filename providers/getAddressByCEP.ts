interface IGetAddressResponse {
  bairro: string;
  cep: string;
  complemento: string;
  ddd: string;
  estado: string;
  gia: string;
  ibge: string;
  localidade: string;
  logradouro: string;
  regiao: string;
  siafi: string;
  uf: string;
  unidade: string;
}

export const getAddress = async (
  value: string
): Promise<IGetAddressResponse | undefined> => {
  const response = await fetch(`https://viacep.com.br/ws/${value}/json/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .catch((err) => err.response);

  if (response.erro === true) {
    return undefined;
  }

  return response;
};
