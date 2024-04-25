export interface IViewport {
  width: number,

  height: number,

  content_width: number,

  content_height: number,
}

export class Viewport {
  private width = 0;

  private height = 0;

  private content_width = 0;

  private content_height = 0;

  get_width() {
    return this.width;
  }

  set_width(new_width: number) {
    this.width = new_width;
  }

  get_height() {
    return this.height;
  }

  set_height(new_height: number) {
    this.height = new_height;
  }

  get_content_width() {
    return this.content_width;
  }

  set_content_width(width: number) {
    this.content_width = width;
  }

  get_content_height() {
    return this.content_height;
  }

  set_content_height(height: number) {
    this.content_height = height;
  }
}