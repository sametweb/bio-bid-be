module.exports = async (array, finder, creator) => {
  for (let i = 0; i < array.length; i++) {
    const found = await finder({ name: array[i].name });
    if (!found) await creator(array[i]);
  }
};
