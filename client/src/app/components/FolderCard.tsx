const FolderCard = ({ folder }: { folder: any }) => {
    return (
      <div className="bg-white shadow-lg rounded p-4">
        <h3 className="text-xl font-semibold">{folder.name}</h3>
        <p className="text-gray-700">{folder.description}</p>
      </div>
    );
  };
  
  export default FolderCard;
  