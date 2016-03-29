<div class="c-icon-list">
  <% _.each(glyphs, function(glyph) { %>
  <div class="c-icon-list__item">
    <i class="icon icon-<%= glyph.name %>"></i>
    <span>.icon-<%= glyph.name %></span>
  </div>
  <% }); %>
</div>
