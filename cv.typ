#import "typst_template/cv.typ": *

// Load CV data from YAML
#let cvdata = yaml("cv.yml")

#let uservars = (
    headingfont: "Geist Mono", // Set font for headings
    bodyfont: "Geist",   // Set font for body
    fontsize: 9pt, // 10pt, 11pt, 12pt
    linespacing: 6pt,
    showAddress: true, // true/false Show address in contact info
    showNumber: false,  // true/false Show phone number in contact info
)

// setrules and showrules can be overridden by re-declaring it here
// #let setrules(doc) = {
//      // Add custom document style rules here
//
//      doc
// }

#let customrules(doc) = {
    // Add custom document style rules here
    set page(
        paper: "us-letter", // a4, us-letter
        margin: 1.25cm, // 1.25cm, 1.87cm, 2.5cm
    )
    doc
}

#let cvinit(doc) = {
    doc = setrules(uservars, doc)
    doc = showrules(uservars, doc)
    doc = customrules(doc)

    doc
}

// Each section function can be overridden by re-declaring it here
// #let cveducation = []

// Content
#show: doc => cvinit(doc)

#cvheading(cvdata, uservars)

#cvwork(cvdata)
#cveducation(cvdata)
#cvaffiliations(cvdata)
#cvprojects(cvdata)
#cvawards(cvdata)
#cvcertificates(cvdata)
#cvpublications(cvdata)
#cvskills(cvdata)
#cvreferences(cvdata)

// #endnote
