/**
 * exhibits.js — draws exhibits (data tables and bar charts).
 *
 * Bar charts are built from plain HTML (not images), so the label and
 * value of every bar are real text that screen readers can read.
 * The exhibit content was rendered and escaped at build time.
 */

export function renderExhibit(ex) {
  const heading = `<span class="exhibit-number">Exhibit ${ex.number}</span> ${ex.title}`;
  const body = ex.kind === 'bar' ? barChart(ex) : table(ex);
  return `
    <figure class="exhibit" id="${ex.id}">
      <figcaption class="exhibit-title">${heading}</figcaption>
      ${body}
      <p class="exhibit-note">${ex.note}</p>
    </figure>`;
}

function table(ex) {
  // A blank top-left header still gets a name for screen readers.
  const head = ex.columns.map((c) => `<th scope="col">${c.trim() ? c : '<span class="visually-hidden">Item</span>'}</th>`).join('');
  const rows = ex.rows
    .map((row) => `<tr>${row.map((cell, i) => (i === 0 ? `<th scope="row">${cell}</th>` : `<td>${cell}</td>`)).join('')}</tr>`)
    .join('');
  return `<div class="table-scroll" tabindex="0" role="region" aria-label="Exhibit ${ex.number} table"><table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
}

function barChart(ex) {
  const max = Math.max(...ex.data.map((d) => d.value), ex.reference?.value ?? 0) || 1;
  const pct = (v) => `${((v / max) * 100).toFixed(2)}%`;
  // An optional reference value (e.g. "requirement: 4 GW") is drawn as a
  // dashed mark at the same position in every bar's track, forming a line.
  const mark = ex.reference ? `<span class="ref-mark" style="left:${pct(ex.reference.value)}"></span>` : '';
  const bars = ex.data
    .map(
      (d) => `
      <li class="bar-row">
        <span class="bar-label">${d.label}</span>
        <span class="bar-track"><span class="bar" style="width:${pct(d.value)}"></span>${mark}</span>
        <span class="bar-value">${d.display}</span>
      </li>`,
    )
    .join('');
  const legend = ex.reference ? `<p class="ref-legend"><span class="ref-swatch" aria-hidden="true"></span>Dashed line: ${ex.reference.label} (${ex.reference.display})</p>` : '';
  return `<div class="bar-chart"><ul class="bars">${bars}</ul>${legend}</div>`;
}
