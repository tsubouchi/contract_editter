export function SearchResults(): HTMLElement & { setResults: (items: any[]) => void } {
  const ul = document.createElement('ul');
  ul.className = 'w-full border border-black p-2 flex flex-col gap-2';

  function setResults(items: any[]) {
    ul.innerHTML = '';
    items.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'border-b border-dashed border-black cursor-pointer hover:bg-gray-100 px-2 py-1';
      li.textContent = item.title || item.id;
      li.onclick = () => {
        window.location.href = `/preview?id=${item.id}`;
      };
      ul.appendChild(li);
    });
  }

  return Object.assign(ul, { setResults });
} 