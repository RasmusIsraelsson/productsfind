export default function sortData(data) {
  const ORDINARY_PRODUCT_OFFER = data[0];

  // Edge case: No need to sort data with one or less elements.
  if (data.length <= 1) {
    data[0].ValidUntil = '';
    return data;
  }

  // Set pure nulls
  data.forEach((element, index) => {
    if (element.ValidFrom === 'NULL') {
      data[index].ValidFrom = null;
    }
    if (element.ValidUntil === 'NULL') {
      data[index].ValidUntil = null;
    }
  });

  let index = 0;
  for (let element of data) {
    const productOfferA = {};
    Object.assign(productOfferA, element);
    const indexB = index + 1;

    // Grab productOfferB if not out of bounds..
    const productOfferB = indexB < data.length ? data[indexB] : null;

    if (productOfferB === null) {
      // Edge Case: Missing price for todays date..

      // Insert ordinary price X into LAST index.
      // X.start = dateA.end, X.end = "", X.Price = elemOne.Price
      const addOrdinaryOffer = {};
      Object.assign(addOrdinaryOffer, ORDINARY_PRODUCT_OFFER);
      addOrdinaryOffer.ValidFrom = productOfferA.ValidUntil;
      addOrdinaryOffer.ValidUntil = '';

      data.push(addOrdinaryOffer);
      break;
    }

    const dateAStart = new Date(productOfferA.ValidFrom);
    const dateAEnd = new Date(productOfferA.ValidUntil);

    const dateBStart = new Date(productOfferB.ValidFrom);
    const dateBEnd = new Date(productOfferB.ValidUntil);

    // Case 1: Dates can't overlap...
    if (dateAEnd > dateBStart) {
      productOfferA.ValidUntil = productOfferB.ValidFrom;
      data[index] = productOfferA;
    } else if (productOfferA.ValidUntil === null) {
      // Case 2: Missing end date...
      productOfferA.ValidUntil = productOfferB.ValidFrom;
      data[index] = productOfferA;
    } else if (dateAEnd < dateBStart) {
      // Case 3: Missing ordinary price between dates...

      // Insert ordinary price X into current index.
      // [ dateA, X, dateB ]
      // X.start = dateA.end, X.end = dateB.start, X.Price = elemOne.Price

      const addOrdinaryOffer = {};
      Object.assign(addOrdinaryOffer, ORDINARY_PRODUCT_OFFER);
      addOrdinaryOffer.ValidFrom = productOfferA.ValidUntil;
      addOrdinaryOffer.ValidUntil = productOfferB.ValidFrom;

      data.splice(indexB, 0, addOrdinaryOffer);
    }

    index++;
  }
  return data;
}
