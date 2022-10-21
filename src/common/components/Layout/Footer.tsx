const Footer = () => {
  return (
    <footer className="flex justify-start justify-self-end mt-16 w-full h-32 border-t shadow-lg align-center border-color-mode footer">
      <div className="flex flex-col m-auto space-y-1 w-full text-center lg:w-1/6">
        <a className="" href="https://daobi.netlify.app/court/">
          DAObi Homepage
        </a>
        <a className="" href="https://twitter.com/DaobiTreasury">
          Twitter
        </a>
        <a className="" href="https://discord.com/invite/HqvVRPZ9Gg">
          Discord
        </a>
        <a className="" href="https://github.com/bluentity/daobi">
          Contract Source Code
        </a>
      </div>
    </footer>
  );
};

export default Footer;
