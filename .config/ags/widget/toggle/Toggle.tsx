import { bind, Variable } from "astal";
import { Gtk  } from "astal/gtk3";
import style from './Toggle.scss';

export function Toggle({active = Variable(false), halign = Gtk.Align.CENTER, valign = Gtk.Align.CENTER, invert = false}) {
  return <button className={bind(active).as(b => `toggle ${(invert ? !b : b) ? 'active' : ''}`)}    css={style} halign={halign} valign={valign}
    onClick={() => active.set(!active.get())}
  >
    <box css={style}
      className="indicator"
      halign={bind(active).as(b => (invert ? !b : b) ? Gtk.Align.END : Gtk.Align.START)}
      valign={Gtk.Align.CENTER}
    />
  </button>
}
