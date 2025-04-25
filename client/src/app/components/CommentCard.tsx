const CommentCard = ({ comment }: { comment: any }) => {
    return (
      <div className="bg-white shadow-lg rounded p-4">
        <p className="text-gray-700">{comment.content}</p>
        <span className="text-gray-500 text-sm">- {comment.user.firstName} {comment.user.lastName}</span>
      </div>
    );
  };
  
  export default CommentCard;
  