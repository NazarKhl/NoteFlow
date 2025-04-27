const ProjectCard = ({ project }: { project: any }) => {
    return (
      <div className="bg-white shadow-lg rounded p-4">
        <h3 className="text-xl font-semibold">{project.name}</h3>
        <p className="text-gray-700">{project.description}</p>
      </div>
    );
  };
  
  export default ProjectCard;
  