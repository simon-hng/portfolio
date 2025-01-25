#import "typst_template/cv.typ": *

// Load CV data from YAML
#let cvdata = yaml("cv.yml")

#let uservars = (
    headingfont: "Linux Libertine", // Set font for headings
    bodyfont: "Linux Libertine",   // Set font for body
    fontsize: 9pt, // 10pt, 11pt, 12pt
    linespacing: 6pt,
    showAddress: false, // true/false Show address in contact info
    showNumber: false,  // true/false Show phone number in contact info
    showProjects: false // true/false Show project section - leads to more than one page for my cv
)

// setrules and showrules can be overridden by re-declaring it here

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

// Address
#let addresstext(info, uservars) = {
    if uservars.showAddress {
        block(width: 100%)[
            #info.personal.location.postalCode
            #info.personal.location.city, #info.personal.location.country
            #v(-4pt)
        ]
    } else {none}
}

// Arrange the contact profiles with a diamond separator
#let contacttext(info, uservars) = block(width: 100%)[
    // Contact Info
    // Create a list of contact profiles
    #let profiles = (
        box(link("mailto:" + info.personal.email)),
        if uservars.showNumber {box(link("tel:" + info.personal.phone))} else {none},
        if info.personal.url != none {
            box(link(info.personal.url)[#info.personal.url.split("//").at(1)])
        }
    ).filter(it => it != none) // Filter out none elements from the profile array

    // Add any social profiles
    #if info.personal.profiles.len() > 0 {
        for profile in info.personal.profiles {
            profiles.push(
                box(link(profile.url)[#profile.url.split("//").at(1)])
            )
        }
    }

    // #set par(justify: false)
    #set text(font: uservars.bodyfont, weight: "medium", size: uservars.fontsize * 1)
    #pad(x: 0em)[
        #profiles.join([#sym.space.en | #sym.space.en])
    ]
]

// Create layout of the title + contact info
#let cvheading(info, uservars) = {
    align(center)[
        = #info.personal.name
        #addresstext(info, uservars)
        #contacttext(info, uservars)
        #v(1em)
    ]
}
// Each section function can be overridden by re-declaring it here
#let cveducation(info, isbreakable: true) = {
    if info.education != none {block[
        == Education
        #for edu in info.education {
            // Parse ISO date strings into datetime objects
            let start = utils.strpdate(edu.startDate)
            let end = utils.strpdate(edu.endDate)

            let edu-items = ""
            if edu.honors.len() != 0 {edu-items = edu-items + "- *Honors*: " + edu.honors.join(", ") + "\n"}
            if edu.courses.len() != 0 {edu-items = edu-items + "- *Courses*: " + edu.courses.join(", ") + "\n"}
            if edu.highlights != none {
                for hi in edu.highlights {
                    edu-items = edu-items + "- " + hi + "\n"
                }
                edu-items = edu-items.trim("\n")
            }

            // Create a block layout for each education entry
            block(width: 100%, breakable: isbreakable)[
                // Line 1: Institution and Location
                #if edu.url != none [
                    *#link(edu.url)[#edu.institution]* #h(1fr) *#edu.location* \
                ] else [
                    *#edu.institution* #h(1fr) *#edu.location* \
                ]
                // Line 2: Degree and Date Range
                #text(style: "italic")[#edu.studyType in #edu.area] #h(1fr)
                #start #sym.dash.en #end \
                #eval(edu-items, mode: "markup")
            ]
        }
    ]}
}

// Projects
#let cvprojects(info, usercars, isbreakable: true) = {
    if uservars.showProjects and info.projects.len() != 0 {block[
        == Projects
        #for project in info.projects {
            // Parse ISO date strings into datetime objects
            let start = utils.strpdate(project.startDate)
            let end = utils.strpdate(project.endDate)
            // Create a block layout for each education entry
            block(width: 100%, breakable: isbreakable)[
                // Line 1: Institution and Location
                #if project.url != none [
                    *#link(project.url)[#project.name]* \
                ] else [
                    *#project.name* \
                ]
                // Line 2: Degree and Date Range
                #text(style: "italic")[#project.affiliation]  #h(1fr) #start #sym.dash.en #end \
                // Summary or Description
                #for hi in project.highlights [
                    - #eval(hi, mode: "markup")
                ]
            ]
        }
    ]}
}

// Skills, Languages, and Interests
#let cvskills(info, isbreakable: true) = {
    if (info.languages != none) or (info.skills != none) or (info.interests != none) {block(breakable: isbreakable)[
        == Skills, Languages, Interests
        #if (info.languages.len() != 0) [
            #let langs = ()
            #for lang in info.languages {
                langs.push([#lang.language (#lang.fluency)])
            }
            - *Languages*: #langs.join(", ")
        ]
        #if (info.skills.len() != 0) [
            #for group in info.skills [
                - *#group.category*: #group.skills.join(", ")
            ]
        ]
        #if (info.interests.len() != 0) [
            - *Interests*: #info.interests.join(", ")
        ]
    ]}
}


// Certifications
#let cvcertificates(info, isbreakable: true) = {
    if info.certificates.len() != 0 {block[
        == Licenses & Certifications

        #for cert in info.certificates {
            // Parse ISO date strings into datetime objects
            let date = utils.strpdate(cert.date)
            // Create a block layout for each education entry
            block(width: 100%, breakable: isbreakable)[
                // Line 1: Institution and Location
                #if cert.url != none [
                    *#link(cert.url)[#cert.name]* \
                ] else [
                    *#cert.name* \
                ]
                // Line 2: Degree and Date Range
                Issued by #text(style: "italic")[#cert.issuer]  #h(1fr) #date \
            ]
        }
    ]}
}

// Research & Publications
#let cvpublications(info, isbreakable: true) = {
    if info.publications.len() != 0 {block[
        == Research & Publications
        #for pub in info.publications {
            // Parse ISO date strings into datetime objects
            let date = utils.strpdate(pub.releaseDate)
            // Create a block layout for each education entry
            block(width: 100%, breakable: isbreakable)[
                // Line 1: Institution and Location
                #if pub.url != none [
                    *#link(pub.url)[#pub.name]* \
                ] else [
                    *#pub.name* \
                ]
                // Line 2: Degree and Date Range
                Published on #text(style: "italic")[#pub.publisher]  #h(1fr) #date \
            ]
        }
    ]}
}

// References
#let cvreferences(info, isbreakable: true) = {
    if info.references.len() != 0 {block[
        == References
        #for ref in info.references {
            block(width: 100%, breakable: isbreakable)[
                #if ref.url != none [
                    - *#link(ref.url)[#ref.name]*: "#ref.reference"
                ] else [
                    - *#ref.name*: "#ref.reference"
                ]
            ]
        }
    ]} else {}
}


// Content
#show: doc => cvinit(doc)

#cvheading(cvdata, uservars)

#cvwork(cvdata)
#cveducation(cvdata)
#cvaffiliations(cvdata)
#cvprojects(cvdata, uservars)
#cvawards(cvdata)
#cvcertificates(cvdata)
#cvpublications(cvdata)
#cvskills(cvdata)
#cvreferences(cvdata)

// #endnote
