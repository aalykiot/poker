export const htmlEntitie = (suit) => {
  switch (suit) {
    case "diams":
      return String.fromCharCode(9830);
    case "hearts":
      return String.fromCharCode(9829);
    case "clubs":
      return String.fromCharCode(9827);
    case "spades":
      return String.fromCharCode(9824);
    default:
      return null;
  }
};
