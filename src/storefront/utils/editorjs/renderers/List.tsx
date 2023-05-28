const ListRenderer = ({ data }: { data: any }) => {
  let content = null;

  if (data.items && Array.isArray(data.items)) {
    content = data.items.map((item: any, index: number) => {
      <li key={index}>{item.text}</li>;
    });
  }
  return content !== null ? <ul>{content}</ul> : <></>;
};

export default ListRenderer;
