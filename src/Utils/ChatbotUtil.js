export const convert_db_data = (data) => {
  return {
    ...data,
    _id: data._id.$oid,
    createdAt: data.createdAt ? data.createdAt.$date : "",
  };
};
