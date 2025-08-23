import { Gdk, Gtk } from "ags/gtk4";
import cairo from "gi://cairo?version=1.0";
import { Accessor } from "gnim";

/** Orientation of the corner relative to the drawing area */
export enum CornerOrientation {
  TOP_LEFT = "top_left",
  TOP_RIGHT = "top_right",
  BOTTOM_LEFT = "bottom_left",
  BOTTOM_RIGHT = "bottom_right",
}

export type RoundedCornerProps = {
  radius: number;
  orientation: CornerOrientation;
  padding?: number;
}

/**
 * Draws a corner with a circle cuttof, like an inverted border-radius.
 * The total size is `radius + padding`.
 * */
export function RoundedCorner(props: RoundedCornerProps) {
  const r = props.radius; // corner radius
  const padding = props.padding ?? 0;
  const size = r + padding;

  let drawing = new Gtk.DrawingArea({
    cssName: "corner",
    hexpand: false, vexpand: false,
  });
  let c = new Gdk.RGBA()
  c.parse("#181818");

  drawing.set_draw_func((area, cr, _width, _height) => {
    area.set_size_request(size, size);
    cr.scale(1,1);

    // clear for transparent background
    cr.setOperator(cairo.Operator.CLEAR);
    cr.paint();
    cr.setOperator(cairo.Operator.ADD); // normal mode

    // NOTE: The line between the starting and ending angles form a quarter of a circumference.
    // Note that `y` axis is inverted, which affects any angle with a `y` component.

    
    switch (props.orientation) {
      case CornerOrientation.TOP_LEFT:
        cr.moveTo(0, size);
        cr.lineTo(padding, size);
        cr.arc(size, size, r, Math.PI, (3 * Math.PI)/2);
        cr.lineTo(size, 0);
        cr.lineTo(0, 0);
        break;
      case CornerOrientation.TOP_RIGHT:
        cr.moveTo(0, 0);
        cr.lineTo(0, padding);
        cr.arc(0, size, r, (3 * Math.PI)/2, Math.PI * 2);
        cr.lineTo(size, size);
        cr.lineTo(size, 0);
        break;
      case CornerOrientation.BOTTOM_LEFT:
        cr.moveTo(size, size);
        cr.lineTo(size, r);
        cr.arc(size, 0, r, (3 * Math.PI)/2, Math.PI);
        cr.lineTo(0, 0);
        cr.lineTo(0, size);
        break;
      case CornerOrientation.BOTTOM_RIGHT:
        cr.moveTo(size, 0);
        cr.lineTo(r, 0);
        cr.arc(0, 0, r, Math.PI*2, Math.PI/2);
        cr.lineTo(0, size);
        cr.lineTo(size, size);
        break;
    }
    cr.closePath();
    cr.setSourceRGBA(c.red, c.green, c.blue, c.alpha);
    cr.fill();
  })

  return drawing;
}

export function DynRoundedCorner(props: RoundedCornerProps & {vspace: Accessor<number>, hspace: Accessor<number>}) {
  const { HORIZONTAL, VERTICAL } = Gtk.Orientation;
  const { TOP_LEFT, BOTTOM_LEFT, BOTTOM_RIGHT, TOP_RIGHT } = CornerOrientation;
  const { vspace, hspace, radius, orientation } = props;
  props.padding = undefined;

  const setup_hSpacer = (self: Gtk.Box) => {
    self.add_css_class("h-spacer");
    self.set_valign(Gtk.Align.START);
    self.set_size_request(hspace.get(), vspace.get()+radius);
    hspace.subscribe(() => {
      self.set_size_request(hspace.get(), self.get_size_request()[1]);
    })
    vspace.subscribe(() => {
      self.set_size_request(self.get_size_request()[0], vspace.get()+radius);
    })
  }
  const setup_vSpacer = (self: Gtk.Box) => {
    self.add_css_class("v-spacer");
    self.set_size_request(self.get_size_request()[0], vspace.get());
    vspace.subscribe(() => {
      self.set_size_request(self.get_size_request()[0], vspace.get());
    })
  }

  const isTop = orientation == TOP_LEFT || orientation == TOP_RIGHT;
  const isLeft = orientation == TOP_LEFT || orientation == BOTTOM_LEFT;

  return (
    <box orientation={HORIZONTAL}>
      { isLeft && <box $={setup_hSpacer} /> }
      <box orientation={VERTICAL}>
        { isTop && <box $={setup_vSpacer} /> }
        <RoundedCorner {...props} />
        { !isTop && <box $={setup_vSpacer} /> }
      </box>
      { !isLeft && <box $={setup_hSpacer} /> }
    </box>
  )
}
