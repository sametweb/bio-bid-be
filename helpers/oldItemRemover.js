module.exports = async (id, tableName, finder, updater) => {
  let old_items = await finder();
  old_items = old_items.map(({ id }) => ({ id }));
  await updater({
    data: {
      [tableName]: {
        disconnect: old_items,
      },
    },
    where: { id },
  });
};
