(function () {
    'use strict';
  
    // kintone のレコード追加・編集画面か確認
    const isKintoneForm = () =>
      location.href.includes('/edit') || location.href.includes('/add');
  
    // 貼り付けイベントハンドラー
    const handlePaste = (event) => {
      const clipboardData = event.clipboardData || window.clipboardData;
      const pastedText = clipboardData.getData('Text');
  
      if (!pastedText || !pastedText.includes('\t')) return; // 表形式でない場合は無視
  
      // ExcelのコピーはTSV形式（タブ区切り）
      const rows = pastedText.trim().split('\n').map(row => row.split('\t'));
    
      // 複数サブテーブルに対応（フォーカスされた要素からsubtableセレクタを取得）
      const active = document.activeElement;
      const subtable = active.closest('.subtable-gaia');
      if (!subtable) {
        alert('Kintoneのサブテーブルが見つかりません');
        return;
      }
  
      const addRowBtn = subtable.querySelector('[class*="add-row-image-gaia"]');
      const rowCount = subtable.querySelectorAll('tbody tr').length;
  
      // 行数が足りない場合は追加
      const requiredRows = rows.length - rowCount;
      for (let i = 0; i < requiredRows; i++) {
        addRowBtn.click();
      }
  
      setTimeout(() => {
        const currentRows = subtable.querySelectorAll('tbody tr');
        rows.forEach((cols, rowIndex) => {
          const row = currentRows[rowIndex];
          if (!row) return;
  
          const inputs = row.querySelectorAll('input[type="text"], textarea, select');
          cols.forEach((val, colIndex) => {
            const input = inputs[colIndex];
            if (input) {
              input.focus();
              input.value = val;
              input.dispatchEvent(new Event('input', { bubbles: true }));
            }
          });
        });
      }, 300);
    };
  
    if (isKintoneForm()) {
      document.addEventListener('paste', handlePaste);
    }
  })();
  