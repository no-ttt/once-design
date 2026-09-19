/* Quote inquiry: prepare a complete email draft using the site's existing flow. */
(() => {
  const form = document.getElementById('quoteForm');
  if (!form) return;
  const fileInput = form.elements.floorPlan;
  fileInput.addEventListener('change', () => {
    document.getElementById('quoteFloorPlanName').textContent = fileInput.files[0]?.name || '';
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(form);
    const lines = [
      `Project type: ${data.get('projectType')}`,
      `Company / shopping mall / building: ${data.get('company')}`,
      `Area (sqft): ${data.get('area')}`,
      `Other requirement: ${data.get('requirement')}`,
      `Name: ${data.get('name')}`,
      `Contact number: ${data.get('phone')}`,
      `Email: ${data.get('email')}`,
      `How did you hear about Once Design? ${data.getAll('source').join(', ')}`,
      `Floor plan: ${fileInput.files[0]?.name || 'None'}${fileInput.files.length ? ' (please attach this file)' : ''}`
    ];
    document.getElementById('quoteEmail').href = `mailto:info@once-hk.com?subject=${encodeURIComponent('Project quote inquiry')}&body=${encodeURIComponent(lines.join('\n'))}`;
    document.getElementById('quoteResponse').hidden = false;
  });
})();
