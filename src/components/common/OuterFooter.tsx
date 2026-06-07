import React from 'react'

interface FooterInterface {
    urlTitle: string;
    urlPath: string;
} 



const footerUrls:FooterInterface[] = [
    {
        urlTitle: "Support",
        urlPath: "/support"
    },

   

    {
        urlTitle: "Documention",
        urlPath: "/documentation"
    },

    {
        urlTitle: "Blog",
        urlPath: "/blog"
    },

    {
        urlTitle: "Licence",
        urlPath: "/licence"
    },


]

const Footer:React.FC = () => {

   
  return (
    <div className=' flex items-center bg-card justify-between h-[70px] text-secondary-color md:mx-0 mx-3 px-5'>
        <h6>&copy; {new Date().getFullYear()} ICMS Portal</h6>
        <div className=' md:flex items-center justify-between gap-4'>
            {/* {footerUrls.map((footerUrl, index) => (
                <a key={index} href={footerUrl.urlPath}>{footerUrl.urlTitle}</a>
            ))} */}
        </div>
    </div>
  )
}

export default Footer