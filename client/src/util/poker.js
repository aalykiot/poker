// Example implementation used in the Think Functional course

//
// Playing Cards class definition and implementation
// in a functional fashiom
//

const _ = require('lodash');

export const Ranks = Object.freeze(['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']);
export const Suits = Object.freeze(['hearts', 'clubs', 'diams', 'spades']);

const Cards = Object.freeze(Object.entries(Ranks).reduce(
  (cards, [weight, rank]) => cards.concat(Suits.map(suit => ({ rank, suit, weight }))),
  [],
));

export class PlayingCards {
  constructor(cards = null, from = 0, to = 0) {
    const cardsSource = cards instanceof Array ? cards : Cards;
    const cardsRange = cardsSource.slice(from, to || cardsSource.length);

    this.cards = Object.freeze(cardsRange.sort(() => Math.random() - 0.5));

    this.genStats();

    Object.freeze(this);
  }

  getNCardsAndRest(n) {
    return {
      cards: new PlayingCards(this.cards, 0, n),
      restCards: new PlayingCards(this.cards, n, this.cards.length),
    };
  }

  genStats() {
    this.ordCards = [...this.cards].sort((a, b) => a.weight - b.weight);
    this.ranks = _.groupBy(this.ordCards, 'rank');
    this.suits = _.groupBy(this.ordCards, 'suit');
    this.rankTimes = _.groupBy(this.ranks, 'length');
    this.suitTimes = _.groupBy(this.suits, 'length');
    this.maxInARow = maxInARow(this.ordCards.map(({ weight }) => weight));
  }

  getOfSameRank(n) { return this.rankTimes[n] || []; }

  getOfSameSuit(n) { return this.suitTimes[n] || []; }

  hasAce() { return !!this.ranks.A; }

  hasOfSameRank(n) { return this.getOfSameRank(n).length; }

  hasOfSameSuit(n) { return this.getOfSameSuit(n).length; }

  hasInARow(n) { return this.maxInARow >= n; }

  getWorstSingles() { return _.sortBy(_.flatten(this.getOfSameRank(1)), 'weight'); }

  getHandRate(type) {
    switch (type) {
      case 'Full House':
        return {
          type,
          weight: _.flatten(this.rankTimes[3])[0].weight,
        };

      case 'One Pair':
        return {
          type,
          weight: _.flatten(this.rankTimes[2])[0].weight,
        };

      case 'Two Pair':
        return {
          type,
          weight: _.flatten(this.rankTimes[2])[2].weight,
        };

      case 'Three of a Kind':
        return {
          type,
          weight: _.flatten(this.rankTimes[3])[0].weight,
        };

      case 'Four of a Kind':
        return {
          type,
          weight: _.flatten(this.rankTimes[4])[0].weight,
        };

      default:
        return {
          type,
          weight: this.ordCards[4].weight,
        };
    }
  }
}

//
// Poker Ratings
//
const PokerRating = {
  'Royal Flush': hand => hand.hasInARow(5) && hand.hasOfSameSuit(5) && hand.hasAce(),
  'Straight Flush': hand => hand.hasInARow(5) && hand.hasOfSameSuit(5),
  'Four of a Kind': hand => hand.hasOfSameRank(4),
  'Full House': hand => hand.hasOfSameRank(3) && hand.hasOfSameRank(2),
  Flush: hand => hand.hasOfSameSuit(5),
  Straight: hand => hand.hasInARow(5),
  'Three of a Kind': hand => hand.hasOfSameRank(3),
  'Two Pair': hand => hand.hasOfSameRank(2) >= 2,
  'One Pair': hand => hand.hasOfSameRank(2),
  'High Card': hand => hand.hasOfSameRank(1) >= 5,
};

const PokerHandRate = playingCards => Object.entries(PokerRating).find(([rate, is]) => is(playingCards))[0];

export const PokerHand = (cards) => {
  const playingCards = new PlayingCards(cards.toJS());

  return playingCards.getHandRate(PokerHandRate(playingCards));
};

export const hasAce = cards => new PlayingCards(cards.toJS()).hasAce();

//
// Max in a Row Utility
//
function maxInARow(nums) {
  return _.chain(nums)
    .sortBy()
    .uniq()
    .map((num, i) => (num - i))
    .groupBy()
    .orderBy('length')
    .last()
    .value()
    .length;
}
