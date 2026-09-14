export interface ExportResumeData {
  fullName?: string;
  jobTitle?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  summary?: string;
  skills?: string[];
  experience?: Array<{
    company: string;
    role: string;
    dates: string;
    location?: string;
    bullets: string[];
  }>;
  education?: Array<{
    degree: string;
    school: string;
    year?: string;
  }>;
  certifications?: Array<{
    name: string;
    issuer?: string;
    year?: string;
  }>;
}

/**
 * Generate ATS-compliant single-color black vector HTML template
 * Uses 10-11pt typography, 0.75in margins, standard serif/sans-serif fonts
 */
export function generateAtsHtml(resume: ExportResumeData): string {
  const name = resume.fullName || 'Candidate Name';
  const title = resume.jobTitle || '';
  const contactParts = [resume.email, resume.phone, resume.location, resume.linkedin].filter(Boolean);

  const skillsHtml = Array.isArray(resume.skills) && resume.skills.length > 0
    ? `
      <section style="margin-bottom: 18px;">
        <h2 style="font-size: 11pt; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #000; padding-bottom: 2px; margin-bottom: 6px; letter-spacing: 0.5px;">Core Competencies & Skills</h2>
        <p style="font-size: 10pt; line-height: 1.4; margin: 0;">${resume.skills.join(' • ')}</p>
      </section>
    `
    : '';

  const summaryHtml = resume.summary
    ? `
      <section style="margin-bottom: 18px;">
        <h2 style="font-size: 11pt; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #000; padding-bottom: 2px; margin-bottom: 6px; letter-spacing: 0.5px;">Professional Summary</h2>
        <p style="font-size: 10pt; line-height: 1.45; margin: 0; text-align: justify;">${resume.summary}</p>
      </section>
    `
    : '';

  const experienceHtml = Array.isArray(resume.experience) && resume.experience.length > 0
    ? `
      <section style="margin-bottom: 18px;">
        <h2 style="font-size: 11pt; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #000; padding-bottom: 2px; margin-bottom: 8px; letter-spacing: 0.5px;">Professional Experience</h2>
        ${resume.experience.map(exp => `
          <div style="margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px;">
              <span style="font-size: 10.5pt; font-weight: bold;">${exp.role || 'Role'}</span>
              <span style="font-size: 9.5pt; font-style: italic;">${exp.dates || ''}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">
              <span style="font-size: 10pt; font-weight: 600; color: #222;">${exp.company || 'Company'}</span>
              <span style="font-size: 9.5pt; color: #444;">${exp.location || ''}</span>
            </div>
            ${Array.isArray(exp.bullets) && exp.bullets.length > 0 ? `
              <ul style="margin: 4px 0 0 0; padding-left: 18px; font-size: 10pt; line-height: 1.45;">
                ${exp.bullets.map(b => `<li style="margin-bottom: 3px;">${b}</li>`).join('')}
              </ul>
            ` : ''}
          </div>
        `).join('')}
      </section>
    `
    : '';

  const educationHtml = Array.isArray(resume.education) && resume.education.length > 0
    ? `
      <section style="margin-bottom: 18px;">
        <h2 style="font-size: 11pt; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #000; padding-bottom: 2px; margin-bottom: 6px; letter-spacing: 0.5px;">Education</h2>
        ${resume.education.map(edu => `
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="font-size: 10pt;"><strong>${edu.degree || 'Degree'}</strong> — ${edu.school || 'University'}</span>
            <span style="font-size: 9.5pt;">${edu.year || ''}</span>
          </div>
        `).join('')}
      </section>
    `
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${name} - Resume</title>
  <style>
    @page {
      size: letter portrait;
      margin: 0.75in;
    }
    body {
      font-family: 'Calibri', 'Arial', 'Helvetica', sans-serif;
      color: #000000;
      background: #ffffff;
      margin: 0;
      padding: 24px;
      line-height: 1.4;
      font-size: 10.5pt;
    }
    h1, h2, h3, p, ul {
      margin: 0;
      color: #000000;
    }
  </style>
</head>
<body>
  <header style="text-align: center; margin-bottom: 16px; border-bottom: 2px solid #000; padding-bottom: 12px;">
    <h1 style="font-size: 18pt; font-weight: bold; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 4px;">${name}</h1>
    ${title ? `<div style="font-size: 11.5pt; font-weight: 600; margin-bottom: 4px;">${title}</div>` : ''}
    <div style="font-size: 9.5pt; color: #111;">
      ${contactParts.join(' &nbsp;|&nbsp; ')}
    </div>
  </header>
  ${summaryHtml}
  ${skillsHtml}
  ${experienceHtml}
  ${educationHtml}
</body>
</html>`;
}

/**
 * Generate Export Package with URLs
 */
export async function generateResumeExport(resume: ExportResumeData) {
  const html = generateAtsHtml(resume);
  const base64Html = Buffer.from(html).toString('base64');
  const htmlDataUri = `data:text/html;charset=utf-8;base64,${base64Html}`;

  return {
    pdfUrl: htmlDataUri,
    docxUrl: htmlDataUri.replace('text/html', 'application/msword'),
    htmlContent: html
  };
}
