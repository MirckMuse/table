export interface IViewport {
  width: number,

  height: number,

  scrollWidth: number,

  scrollHeight: number,
}

export class Viewport implements IViewport {
  width = 0;

  height = 0;

  scrollWidth = 0;

  scrollHeight = 0;
}