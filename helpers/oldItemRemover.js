module.exports = async (companyName, tableName, finder, updater) => {
  let old_items = await finder();
  old_items = old_items.map(({ id }) => ({ id }));
  await updater({
    data: {
      [tableName]: {
        disconnect: old_items,
      },
    },
    where: { name: companyName },
  });
};
