pub struct BBox {
  width: i32;

  height: i32;

  scroll_width: i32;

  scroll_height: i32;
}

// TODO:
pub struct CollMeta {}

// TODO:
pub struct RowMeta{}

type RowData = Any;

pub struct TableState {
  bbox: BBox;

  viewport: BBox;

  col_meta: HashMap<String, CollMeta>; 

  row_meta_indexes: Vec[String];

  row_meta: HashMap<String, RowMeta>;

  data_source: Vec<RowData>;
}
