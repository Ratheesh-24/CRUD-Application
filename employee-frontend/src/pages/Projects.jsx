import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import ProjectForm from '../components/ProjectForm';
import { getAllProjects, createProject, updateProject, deleteProject, getAllEmployees } from '../services/api';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [projectsResponse, employeesResponse] = await Promise.all([
                getAllProjects(),
                getAllEmployees()
            ]);
            setProjects(projectsResponse.data || []);
            setEmployees(employeesResponse.data?.employees || []);
        } catch (error) {
            toast.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (formData) => {
        try {
            if (selectedProject) {
                await updateProject(selectedProject.id, formData);
                toast.success('Project updated successfully');
            } else {
                await createProject(formData);
                toast.success('Project created successfully');
            }
            fetchData();
            setShowForm(false);
            setSelectedProject(null);
        } catch (error) {
            toast.error(error.message || 'Failed to save project');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await deleteProject(id);
                toast.success('Project deleted successfully');
                fetchData();
            } catch (error) {
                toast.error('Failed to delete project');
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed':
                return 'bg-green-100 text-green-800';
            case 'In Progress':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Project Management</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Manage your projects and assignments
                </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-4 py-2.5 bg-blue-800 text-white rounded-xl 
                            hover:opacity-90 transition-all duration-200 shadow-lg 
                            hover:shadow-blue-500/25 inline-flex items-center"
                    >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Add New Project
                    </button>
                </div>

                <div className="container mx-auto ml-4 p-6">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                        Project Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                        Description
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                        Timeline
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                        Assigned To
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {projects.map((project) => (
                                    <tr key={project.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {project.name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {project.description}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(project.startDate).toLocaleDateString()} - 
                                            {new Date(project.endDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 
                                                font-semibold rounded-full ${getStatusColor(project.status)}`}>
                                                {project.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {employees.find(emp => emp.id === project.employeeId)?.firstName || 'Unassigned'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => {
                                                    setSelectedProject(project);
                                                    setShowForm(true);
                                                }}
                                                className="text-blue-600 hover:text-blue-900 mr-4"
                                            >
                                                <PencilIcon className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(project.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {showForm && (
                <ProjectForm
                    project={selectedProject}
                    employees={employees}
                    onSubmit={handleSubmit}
                    onClose={() => {
                        setShowForm(false);
                        setSelectedProject(null);
                    }}
                />
            )}
        </div>
    );
};

export default Projects;