import Vars from "../Vars";
import { Gdk, Gtk } from "ags/gtk4";
import cairo from "gi://cairo?version=1.0";
import { Accessor } from "gnim";
import { extract } from "../utils";

export function CircularLevel(props: {
  value: number | Accessor<number>,
  max?: number,
  label: string,
  transform?: (value: number) => string,
  radius?: number,
  line_width?: number,
}) {

  const max_value = props.max ?? 1;
  const transform = props.transform ?? ((value: number) => (value/max_value * 100).toFixed(1) + "%");
  const background = Vars["bg-alt"];
  const r = props.radius ?? 30;
  const line_width = props.line_width ?? Vars.spacing;
  const R = r + line_width;
  const size = (r + line_width) * 2;

  const c = new Gdk.RGBA();

  return <overlay
    css_name="circular-level"

  >
    <drawingarea
      hexpand={false}
      vexpand={false}
      $={self => {
        self.set_draw_func((area, cr, _width, _height) => {
          const percentage = extract(props.value) / max_value;
          const min = 5/6 * Math.PI;
          const max = (2 + 1/6) * Math.PI; // +2RAD to simulate 360deg
          const range = [min, ((max-min) * (percentage) + min)];

          area.set_size_request(size, size);
          cr.scale(1,1);

          // clear for transparent background
          cr.setOperator(cairo.Operator.CLEAR);
          cr.paint();
          cr.setOperator(cairo.Operator.ADD); // normal mode

          cr.setLineWidth(line_width);

          // draw background
          c.parse(background);
          cr.arc(R, R, r, min, max);
          cr.setSourceRGBA(c.red, c.green, c.blue, 1);
          cr.stroke();

          // draw foreground
          if (percentage >= 0.75) c.parse("coral");
          if (percentage >= 0.25) c.parse("darkorange");
          else c.parse(Vars.accent);
          cr.arc(R, R, r, range[0], range[1]);
          cr.setSourceRGBA(c.red, c.green, c.blue, 1);
          cr.stroke();
        })

        props.value instanceof Accessor && props.value.subscribe(() => {
          self.queue_draw();
        })
      }}
    />
    <label
      label={props.value instanceof Accessor
        ? props.value.as(transform)
        : transform(props.value)}
      valign={Gtk.Align.CENTER}
      $type="overlay"
    />
    <label
      label={props.label}
      valign={Gtk.Align.END}
      $type="overlay"
    />
  </overlay>
}
