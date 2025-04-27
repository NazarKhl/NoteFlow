const NoteCard = ({ note }: { note: any }) => {
    return (
      <div className="bg-white shadow-lg rounded p-4">
        <h3 className="text-xl font-semibold">{note.title}</h3>
        <p className="text-gray-700">{note.content}</p>
      </div>
    );
  };
  
  export default NoteCard;
  