const formatDate = (unformattedDate: string): string => {
  const date = new Date(unformattedDate.slice(0, 10));

  return new Intl.DateTimeFormat('pt-BR').format(date);
};

export default formatDate;
