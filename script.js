// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('enrollmentForm');
    
    // Conditional field logic
    setupConditionalFields();
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        console.log('Form submitted');
        
        if (validateForm()) {
            try {
                generatePDF();
            } catch (error) {
                console.error('Error generating PDF:', error);
                alert('Error generating PDF: ' + error.message + '\n\nPlease check the browser console for details.');
            }
        }
    });
});

// Setup conditional field displays
function setupConditionalFields() {
    // Rebatcher custIDs field
    const rebatcherYes = document.getElementById('rebatcher_yes');
    const rebatcherCustidsField = document.getElementById('rebatcher_custids_field');
    
    document.querySelectorAll('input[name="rebatcher"]').forEach(radio => {
        radio.addEventListener('change', function() {
            if (rebatcherYes.checked) {
                rebatcherCustidsField.style.display = 'block';
            } else {
                rebatcherCustidsField.style.display = 'none';
            }
        });
    });
    
    // Enrollment contact field
    const sameContactNo = document.getElementById('same_contact_no');
    const enrollmentContactField = document.getElementById('enrollment_contact_field');
    
    document.querySelectorAll('input[name="same_enrollment_contact"]').forEach(radio => {
        radio.addEventListener('change', function() {
            if (sameContactNo.checked) {
                enrollmentContactField.style.display = 'block';
            } else {
                enrollmentContactField.style.display = 'none';
            }
        });
    });
    
    // Consultation type "Other" field
    const consultOther = document.getElementById('consult_other');
    const consultOtherField = document.getElementById('consult_other_field');
    
    consultOther.addEventListener('change', function() {
        if (this.checked) {
            consultOtherField.style.display = 'block';
        } else {
            consultOtherField.style.display = 'none';
        }
    });
}

// Validate form
function validateForm() {
    // Check if at least one application is selected
    const applications = document.querySelectorAll('input[name="applications"]:checked');
    if (applications.length === 0) {
        alert('Please select at least one Application.');
        return false;
    }
    
    // Check if at least one consultation type is selected
    const consultTypes = document.querySelectorAll('input[name="consultation_type"]:checked');
    if (consultTypes.length === 0) {
        alert('Please select at least one Type of Consultation.');
        return false;
    }
    
    return true;
}

// Generate PDF
function generatePDF() {
    // Check if jsPDF is available
    if (!window.jspdf) {
        alert('PDF library not loaded. Please refresh the page and try again.');
        console.error('jsPDF library is not available');
        return;
    }
    
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        const submitBtn = document.querySelector('.submit-btn');
        submitBtn.classList.add('loading');
        submitBtn.textContent = 'Generating PDF...';
        submitBtn.disabled = true;
        
        // Get form data
        const formData = getFormData();
        console.log('Form data collected:', formData);
        
        // Set font
        doc.setFont('helvetica');
        
        let y = 20;
        const leftMargin = 20;
        const rightMargin = 190;
        const lineHeight = 7;
    
    // Header
    doc.setFontSize(24);
    doc.setTextColor(255, 107, 53); // Waystar orange
    doc.text('WAYSTAR', leftMargin, y);
    
    y += 10;
    doc.setFontSize(18);
    doc.setTextColor(44, 62, 80);
    doc.text('Enrollment Consultation', leftMargin, y);
    
    y += 7;
    doc.setFontSize(12);
    doc.setTextColor(102, 102, 102);
    doc.text('Request for short term Enrollment Consultant', leftMargin, y);
    
    y += 15;
    
    // Section: Account Information
    addSectionHeader(doc, 'Account Information', y);
    y += 10;
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    doc.text(`Name: ${formData.account_name}`, leftMargin, y);
    doc.text(`Cust ID: ${formData.cust_id}`, 120, y);
    y += lineHeight;
    
    doc.text('Applications:', leftMargin, y);
    y += lineHeight;
    doc.setFontSize(9);
    doc.text(formData.applications.join(', '), leftMargin + 5, y);
    y += lineHeight;
    
    doc.setFontSize(10);
    if (formData.eob_conversion) {
        doc.text(`EOB Conversion: ${formData.eob_conversion}`, leftMargin, y);
        y += lineHeight;
    }
    
    if (formData.rebatcher) {
        doc.text(`Rebatcher: ${formData.rebatcher}`, leftMargin, y);
        y += lineHeight;
        if (formData.rebatcher === 'Y' && formData.rebatcher_custids) {
            doc.setFontSize(9);
            doc.text(`  CustIDs: ${formData.rebatcher_custids}`, leftMargin, y);
            y += lineHeight;
            doc.setFontSize(10);
        }
    }
    
    if (formData.domain_child_accounts) {
        doc.text('Domain/Child Accounts:', leftMargin, y);
        y += lineHeight;
        doc.setFontSize(9);
        const domainLines = doc.splitTextToSize(formData.domain_child_accounts, rightMargin - leftMargin - 5);
        doc.text(domainLines, leftMargin + 5, y);
        y += (domainLines.length * lineHeight);
        doc.setFontSize(10);
    }
    
    y += 5;
    
    // Section: Client Contact Information
    if (y > 240) {
        doc.addPage();
        y = 20;
    }
    
    addSectionHeader(doc, 'Client Contact Information', y);
    y += 10;
    
    doc.text(`Full Name: ${formData.contact_full_name}`, leftMargin, y);
    doc.text(`Phone: ${formData.contact_phone}`, 120, y);
    y += lineHeight;
    
    doc.text(`Email: ${formData.contact_email}`, leftMargin, y);
    y += lineHeight;
    doc.text(`Title: ${formData.contact_title}`, leftMargin, y);
    y += lineHeight;
    
    doc.text(`Same as Enrollment Contact: ${formData.same_enrollment_contact}`, leftMargin, y);
    y += lineHeight;
    
    if (formData.enrollment_contact_details) {
        doc.text('Enrollment Contact Details:', leftMargin, y);
        y += lineHeight;
        doc.setFontSize(9);
        const contactLines = doc.splitTextToSize(formData.enrollment_contact_details, rightMargin - leftMargin - 5);
        doc.text(contactLines, leftMargin + 5, y);
        y += (contactLines.length * lineHeight);
        doc.setFontSize(10);
    }
    
    y += 5;
    
    // Section: Additional Consultation Information
    if (y > 220) {
        doc.addPage();
        y = 20;
    }
    
    addSectionHeader(doc, 'Additional Consultation Information', y);
    y += 10;
    
    doc.text('Type of Consultation:', leftMargin, y);
    y += lineHeight;
    doc.setFontSize(9);
    formData.consultation_type.forEach(type => {
        doc.text(`• ${type}`, leftMargin + 5, y);
        y += lineHeight;
    });
    doc.setFontSize(10);
    
    if (formData.consult_other_specify) {
        doc.setFontSize(9);
        const otherLines = doc.splitTextToSize(formData.consult_other_specify, rightMargin - leftMargin - 10);
        doc.text(otherLines, leftMargin + 10, y);
        y += (otherLines.length * lineHeight);
        doc.setFontSize(10);
    }
    
    y += 3;
    doc.text(`Estimated Project Length: ${formData.project_length}`, leftMargin, y);
    y += lineHeight;
    
    if (formData.length_custom) {
        doc.setFontSize(9);
        doc.text(`  Custom: ${formData.length_custom}`, leftMargin, y);
        y += lineHeight;
        doc.setFontSize(10);
    }
    
    doc.text(`Preferred Start Date: ${formData.preferred_start_date}`, leftMargin, y);
    y += lineHeight + 3;
    
    if (formData.mrr_billing_npis) {
        doc.text('MRR/Billing NPIs:', leftMargin, y);
        y += lineHeight;
        doc.setFontSize(9);
        const mrrLines = doc.splitTextToSize(formData.mrr_billing_npis, rightMargin - leftMargin - 5);
        doc.text(mrrLines, leftMargin + 5, y);
        y += (mrrLines.length * lineHeight);
        doc.setFontSize(10);
        y += 3;
    }
    
    // Check if we need a new page
    if (y > 200) {
        doc.addPage();
        y = 20;
    }
    
    if (formData.priority_payers) {
        doc.text('Priority Payers/Functions:', leftMargin, y);
        y += lineHeight;
        doc.setFontSize(9);
        const payerLines = doc.splitTextToSize(formData.priority_payers, rightMargin - leftMargin - 5);
        doc.text(payerLines, leftMargin + 5, y);
        y += (payerLines.length * lineHeight);
        doc.setFontSize(10);
        y += 3;
    }
    
    if (formData.other_info) {
        doc.text('Other Information:', leftMargin, y);
        y += lineHeight;
        doc.setFontSize(9);
        const otherLines = doc.splitTextToSize(formData.other_info, rightMargin - leftMargin - 5);
        doc.text(otherLines, leftMargin + 5, y);
        y += (otherLines.length * lineHeight);
        doc.setFontSize(10);
        y += 5;
    }
    
    // Waystar Representatives
    if (y > 240) {
        doc.addPage();
        y = 20;
    }
    
    addSectionHeader(doc, 'Waystar Account Representatives', y);
    y += 10;
    
    if (formData.csm || formData.ssa || formData.sales_rep) {
        if (formData.csm) {
            doc.text(`CSM: ${formData.csm}`, leftMargin, y);
            y += lineHeight;
        }
        if (formData.ssa) {
            doc.text(`SSA: ${formData.ssa}`, leftMargin, y);
            y += lineHeight;
        }
        if (formData.sales_rep) {
            doc.text(`Sales Rep: ${formData.sales_rep}`, leftMargin, y);
            y += lineHeight;
        }
    } else {
        doc.setFontSize(9);
        doc.setTextColor(128, 128, 128);
        doc.text('None specified', leftMargin, y);
        y += lineHeight;
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
    }
    
    y += 10;
    
    // Next Steps box
    if (y > 230) {
        doc.addPage();
        y = 20;
    }
    
    doc.setDrawColor(106, 175, 176);
    doc.setFillColor(232, 244, 248);
    doc.rect(leftMargin - 5, y - 5, rightMargin - leftMargin + 10, 25, 'FD');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Next Steps:', leftMargin, y + 2);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    
    const nextStepsText = 'An Enrollment leader on the Support team will review this request for approval. If approved, an enrollment resource will be assigned and a project timeline will be agreed upon.';
    const nextStepsLines = doc.splitTextToSize(nextStepsText, rightMargin - leftMargin - 5);
    doc.text(nextStepsLines, leftMargin, y + 9);
    
    // Save PDF
    const filename = `Enrollment_Consultation_Request_${formData.account_name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
    console.log('PDF saved:', filename);
    
    // Reset button
    setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.textContent = 'Generate PDF';
        submitBtn.disabled = false;
        
        // Show success message
        alert('PDF generated successfully!');
    }, 500);
    
    } catch (error) {
        console.error('Error in PDF generation:', error);
        
        // Reset button
        const submitBtn = document.querySelector('.submit-btn');
        submitBtn.classList.remove('loading');
        submitBtn.textContent = 'Generate PDF';
        submitBtn.disabled = false;
        
        // Show error to user
        alert('Error generating PDF: ' + error.message + '\n\nPlease try again or contact support.');
        throw error; // Re-throw for outer catch
    }
}

// Helper function to add section headers
function addSectionHeader(doc, title, y) {
    doc.setFillColor(106, 175, 176);
    doc.rect(15, y - 5, 180, 8, 'F');
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 20, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
}

// Get form data
function getFormData() {
    const data = {
        account_name: document.getElementById('account_name').value,
        cust_id: document.getElementById('cust_id').value,
        applications: [],
        eob_conversion: getRadioValue('eob_conversion'),
        rebatcher: getRadioValue('rebatcher'),
        rebatcher_custids: document.getElementById('rebatcher_custids').value,
        domain_child_accounts: document.getElementById('domain_child_accounts').value,
        
        contact_full_name: document.getElementById('contact_full_name').value,
        contact_phone: document.getElementById('contact_phone').value,
        contact_email: document.getElementById('contact_email').value,
        contact_title: document.getElementById('contact_title').value,
        same_enrollment_contact: getRadioValue('same_enrollment_contact'),
        enrollment_contact_details: document.getElementById('enrollment_contact_details').value,
        
        consultation_type: [],
        consult_other_specify: document.getElementById('consult_other_specify').value,
        project_length: getRadioValue('project_length'),
        length_custom: document.getElementById('length_custom').value,
        preferred_start_date: document.getElementById('preferred_start_date').value,
        mrr_billing_npis: document.getElementById('mrr_billing_npis').value,
        priority_payers: document.getElementById('priority_payers').value,
        other_info: document.getElementById('other_info').value,
        
        csm: document.getElementById('csm').value,
        ssa: document.getElementById('ssa').value,
        sales_rep: document.getElementById('sales_rep').value
    };
    
    // Get checked applications
    document.querySelectorAll('input[name="applications"]:checked').forEach(checkbox => {
        data.applications.push(checkbox.value);
    });
    
    // Get checked consultation types
    document.querySelectorAll('input[name="consultation_type"]:checked').forEach(checkbox => {
        data.consultation_type.push(checkbox.value);
    });
    
    return data;
}

// Helper to get radio button value
function getRadioValue(name) {
    const radio = document.querySelector(`input[name="${name}"]:checked`);
    return radio ? radio.value : '';
}
