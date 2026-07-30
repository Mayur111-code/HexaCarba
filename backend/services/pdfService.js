const PDFDocument = require('pdfkit');

const FONT = 'Helvetica';
const FONT_B = 'Helvetica-Bold';
const FS = 8;
const FS_SM = 7;
const FS_LG = 10;
const FS_XL = 13;
const LM = 30;
const PAGE_W = 525;
const CONTENT_W = PAGE_W - LM * 2;

const monthName = (m) =>
  ['January','February','March','April','May','June','July','August','September','October','November','December'][(m || 1) - 1];

const fmt = (n) => (n || 0).toLocaleString('en-IN');

const numberToWords = (n) => {
  if (!n || n === 0) return 'Zero Only';
  const a = ['','One ','Two ','Three ','Four ','Five ','Six ','Seven ','Eight ','Nine ','Ten ','Eleven ','Twelve ','Thirteen ','Fourteen ','Fifteen ','Sixteen ','Seventeen ','Eighteen ','Nineteen '];
  const b = ['','','Twenty ','Thirty ','Forty ','Fifty ','Sixty ','Seventy ','Eighty ','Ninety '];
  const numToWords = (num) => {
    if (num < 20) return a[num];
    return b[Math.floor(num / 10)] + a[num % 10];
  };
  const c = (num) => {
    if (num < 100) return numToWords(num);
    return a[Math.floor(num / 100)] + 'Hundred ' + (num % 100 !== 0 ? 'and ' + numToWords(num % 100) : '');
  };
  let r = '';
  const cr = Math.floor(n / 10000000);
  const l = Math.floor((n % 10000000) / 100000);
  const t = Math.floor((n % 100000) / 1000);
  const h = n % 1000;
  if (cr) r += c(cr) + 'Crore ';
  if (l) r += c(l) + 'Lakh ';
  if (t) r += c(t) + 'Thousand ';
  if (h) r += c(h);
  return r.trim() + ' Only';
};

const hLine = (doc, y, color = '#000', x = LM, w = CONTENT_W) => {
  doc.moveTo(x, y).lineTo(x + w, y).lineWidth(0.5).stroke(color);
};

const cell = (doc, text, x, y, w, opts = {}) => {
  doc.font(opts.bold ? FONT_B : FONT).fontSize(opts.size || FS).fillColor(opts.color || '#000');
  doc.text(text, x, y, { width: w, align: opts.align || 'left', lineBreak: false });
};

const generateSalaryPDF = (salary) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: LM, size: 'A4' });
      const chunks = [];
      doc.on('data', (c) => chunks.push(c));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const emp = salary.employee;
      const e = (field) => (emp && emp[field] !== undefined && emp[field] !== null) ? String(emp[field]) : '';

      let y = 30;

      cell(doc, 'FORMAT: HR/DOC-01/PAYSLIP/R1/23', LM, y, CONTENT_W, { size: FS_SM, color: '#555' });
      y += 14;

      doc.font(FONT_B).fontSize(FS_XL).text('HEXACARB ENGINEERS PRIVATE LIMITED', LM, y, { align: 'center' });
      y += 16;

      doc.font(FONT).fontSize(FS_SM).text('ADD: 8/11, NEAR ICICI BANK, MIDC SATPUR, NASHIK-422007, MAHARASHTRA, INDIA', LM, y, { align: 'center' });
      y += 10;
      doc.text(`CIN: ${e('cin') || ''}`, LM, y, { align: 'center' });
      y += 14;

      doc.font(FONT_B).fontSize(FS_LG).text(`PAYSLIP FOR THE MONTH OF ${(monthName(salary.month) + ' ' + salary.year).toUpperCase()}`, LM, y, { align: 'center' });
      y += 14;

      hLine(doc, y);
      y += 1;

      const labelX = LM;
      const colonX = LM + 100;
      const valX = LM + 104;

      const empField = (label, val, ry) => {
        doc.font(FONT).fontSize(FS).fillColor('#000').text(label, labelX, ry);
        doc.text(':', colonX, ry);
        doc.font(FONT_B).text(val, valX, ry);
      };

      const groups = [
        [
          ['EMP NUMBER', e('employeeId')],
          ['EMP NAME', `${e('firstName')} ${e('lastName')}`.trim()],
        ],
        [
          ['DEPARTMENT', e('department')],
          ['PERMANENT ADDRESS', e('permanentAddress')],
        ],
        [
          ['LOCATION', e('location')],
          ['GENDER', e('gender')],
          ['PF NO.', e('pfNo')],
        ],
        [
          ['DATE OF BIRTH', e('dateOfBirth') ? new Date(e('dateOfBirth')).toLocaleDateString('en-IN') : ''],
          ['DESIGNATION', e('designation')],
          ['ESI NO.', e('esiNo')],
        ],
        [
          ['DATE OF JOINING', e('joiningDate') ? new Date(e('joiningDate')).toLocaleDateString('en-IN') : ''],
          ['MOBILE NO.', e('mobileNo') || e('phone')],
          ['PAN NO.', e('panNo')],
        ],
        [
          ['UAN', e('uanNo')],
          ['BANK NAME & BRANCH', [e('bankName'), e('bankBranch')].filter(Boolean).join(' - ')],
          ['EPS NO.', e('epsNo')],
        ],
        [
          ['AADHAR NO', e('aadharNo')],
          ['BANK ACCOUNT NO.', e('bankAccountNo')],
          ['NPS NO.', e('npsNo')],
        ],
      ];

      groups.forEach((group) => {
        group.forEach(([lbl, val]) => {
          empField(lbl, val, y);
          y += 10;
        });
        y += 2;
      });
      y += 2;

      hLine(doc, y);
      y += 1;

      cell(doc, `TAX REGIME`, LM, y, 120, { bold: true });
      cell(doc, `: ${salary.taxRegime || ''}`, LM + 120, y, CONTENT_W - 120, { bold: true });
      y += 14;

      hLine(doc, y);
      y += 1;

      const gap = 5;
      const halfW = (CONTENT_W - gap) / 2;
      const labelW = halfW * 0.65;
      const amtW = halfW * 0.35;

      const eLabelX = LM;
      const eAmtX = LM + labelW;
      const dLabelX = LM + halfW + gap;
      const dAmtX = LM + halfW + gap + labelW;

      cell(doc, 'EARNINGS', eLabelX, y, labelW, { bold: true });
      cell(doc, 'AMOUNT', eAmtX, y, amtW, { bold: true, align: 'right' });
      cell(doc, 'DEDUCTIONS', dLabelX, y, labelW, { bold: true });
      cell(doc, 'AMOUNT', dAmtX, y, amtW, { bold: true, align: 'right' });
      y += 11;

      hLine(doc, y);
      y += 1;

      const earnItems = [
        ['BASIC', salary.basic],
        ['HOUSE RENT ALLOWANCE', salary.hra],
        ['SPECIAL HRA', salary.specialHra],
        ['MEDICAL ALLOWANCE', salary.medicalAllowance],
        ['OTHER ALLOWANCE', salary.otherAllowance],
        ['OVERTIME', salary.overtime],
      ];
      const dedItems = [
        ['EMPLOYEE PF', salary.employeePf],
        ['PROFESSIONAL TAX', salary.professionalTax],
        ['LOAN DEDUCTIONS', salary.loanDeductions],
        ['OTHERS', salary.otherDeductions],
      ];

      const maxRow = Math.max(earnItems.length, dedItems.length);
      for (let i = 0; i < maxRow; i++) {
        if (i < earnItems.length) {
          const [lbl, val] = earnItems[i];
          cell(doc, lbl, eLabelX, y, labelW);
          cell(doc, val ? fmt(val) : '', eAmtX, y, amtW, { align: 'right' });
        }
        if (i < dedItems.length) {
          const [lbl, val] = dedItems[i];
          cell(doc, lbl, dLabelX, y, labelW);
          cell(doc, val ? fmt(val) : '', dAmtX, y, amtW, { align: 'right' });
        }
        y += 10;
      }

      hLine(doc, y);
      y += 1;

      cell(doc, 'TOTAL EARNINGS', eLabelX, y, labelW, { bold: true });
      cell(doc, fmt(salary.totalEarnings), eAmtX, y, amtW, { bold: true, align: 'right' });
      cell(doc, 'TOTAL DEDUCTION', dLabelX, y, labelW, { bold: true });
      cell(doc, fmt(salary.totalDeductions), dAmtX, y, amtW, { bold: true, align: 'right' });
      y += 14;

      hLine(doc, y, '#000', LM, CONTENT_W);
      y += 2;

      doc.font(FONT_B).fontSize(FS_LG);
      cell(doc, 'NET PAY', LM, y, 100);
      doc.text(`: ${fmt(salary.netSalary)}`, LM + 100, y);
      y += 16;

      doc.font(FONT).fontSize(FS);
      doc.text(`IN WORDS: ${numberToWords(salary.netSalary)}`, LM, y);
      y += 14;

      hLine(doc, y, '#000', LM, CONTENT_W);
      y += 2;

      doc.font(FONT_B).fontSize(FS_LG).text('LOAN OUTSTANDING', LM, y);
      y += 14;

      const loanItems = [
        ['DATE', salary.loanOutstanding?.date ? new Date(salary.loanOutstanding.date).toLocaleDateString('en-IN') : ''],
        ['BALANCE', salary.loanOutstanding?.balance ? fmt(salary.loanOutstanding.balance) : ''],
        ['DEDUCTION FOR MONTH', salary.loanOutstanding?.deductionForMonth ? fmt(salary.loanOutstanding.deductionForMonth) : ''],
        ['PRINCIPAL', salary.loanOutstanding?.principal ? fmt(salary.loanOutstanding.principal) : ''],
        ['INTEREST', salary.loanOutstanding?.interest ? fmt(salary.loanOutstanding.interest) : ''],
      ];

      const halfLoan = Math.ceil(loanItems.length / 2);
      loanItems.forEach(([lbl, val], i) => {
        const col = i < halfLoan ? LM : LM + CONTENT_W / 2;
        const ry = y + (i < halfLoan ? i : i - halfLoan) * 11;
        cell(doc, `${lbl}:`, col, ry, (CONTENT_W / 2) - 80);
        cell(doc, val, col + 100, ry, CONTENT_W / 2 - 100);
      });
      y += halfLoan * 11 + 6;

      hLine(doc, y, '#000', LM, CONTENT_W);
      y += 2;

      doc.font(FONT_B).fontSize(FS_LG).text('ATTENDANCE', LM, y);
      y += 14;

      const attItems = [
        ['DAYS IN MONTH', salary.attendance?.daysInMonth],
        ['OFF DAYS', salary.attendance?.offDays],
        ['LOP DAYS', salary.attendance?.lopDays],
        ['NET WORKING DAYS', salary.attendance?.netWorkingDays],
      ];

      attItems.forEach(([lbl, val], i) => {
        const col = i < 2 ? LM : LM + CONTENT_W / 2;
        const ry = y + (i < 2 ? i : i - 2) * 11;
        cell(doc, `${lbl}:`, col, ry, (CONTENT_W / 2) - 80);
        cell(doc, val != null ? String(val) : '', col + 100, ry, CONTENT_W / 2 - 100);
      });
      y += 26;

      hLine(doc, y, '#000', LM, CONTENT_W);
      y += 2;

      doc.font(FONT_B).fontSize(FS_LG).text('WORKING HOURS', LM, y);
      y += 14;

      const whItems = [
        ['AGGREGATE', salary.workingHours?.aggregate],
        ['FIRST SHIFT (HR)', salary.workingHours?.firstShift],
        ['OVERTIME (HR)', salary.workingHours?.overtimeHr],
        ['TOTAL WORKING HOURS', salary.workingHours?.totalWorkingHours],
      ];

      whItems.forEach(([lbl, val], i) => {
        const col = i < 2 ? LM : LM + CONTENT_W / 2;
        const ry = y + (i < 2 ? i : i - 2) * 11;
        cell(doc, `${lbl}:`, col, ry, (CONTENT_W / 2) - 80);
        cell(doc, val != null ? String(val) : '', col + 100, ry, CONTENT_W / 2 - 100);
      });
      y += 26;

      hLine(doc, y, '#000', LM, CONTENT_W);
      y += 12;

      const footerW = CONTENT_W / 2 - 20;
      cell(doc, `PREP. BY: ${salary.preparer || ''}`, LM, y, footerW);
      cell(doc, `DATE: ${new Date().toLocaleDateString('en-IN')}`, LM, y + 12, footerW);

      cell(doc, `APPROVED BY: ${salary.approver || ''}`, LM + footerW + 40, y, footerW);
      cell(doc, `DATE: ${new Date().toLocaleDateString('en-IN')}`, LM + footerW + 40, y + 12, footerW);

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { generateSalaryPDF };
