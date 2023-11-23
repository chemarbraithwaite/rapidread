const EmptyWorkspace = ({ ...props }) => {
  return (
    <div {...props}>
      <h1 className="text-3xl w-full font-bold text-center text-slate-900">
        Maximize productivity 📚
      </h1>
      <p className="text-xl mt-5 text-center ">
        Copy and paste a link or text to get started
      </p>
    </div>
  );
};

export default EmptyWorkspace;
