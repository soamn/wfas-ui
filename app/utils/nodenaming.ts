export const getNodeRef = (node: { id: string; data: { type: string } }) => {
  const shortId = node.id.split("-")[0].slice(0, 4);
  return `${node.data.type}_${shortId}`;
};
