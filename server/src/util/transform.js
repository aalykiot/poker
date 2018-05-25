export default (title) => {
  switch (title) {
    case 'Royal Flush':
      return 10;
    case 'Straight Flush':
      return 9;
    case 'Four of a Kind':
      return 8;
    case 'Full House':
      return 7;
    case 'Flush':
      return 6;
    case 'Straight':
      return 5;
    case 'Three of a Kind':
      return 4;
    case 'Two Pair':
      return 3;
    case 'One Pair':
      return 2;
    default:
      return 1;
  }
};
