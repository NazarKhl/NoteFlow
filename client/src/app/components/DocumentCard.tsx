const DocumentCard = ({ document }: { document: any }) => {
    return (
      <div className="bg-white shadow-lg rounded p-4">
        <h3 className="text-xl font-semibold">{document.title}</h3>
        <p className="text-gray-700">{document.content}</p>
      </div>
    );
  };
  
  export default DocumentCard;
  