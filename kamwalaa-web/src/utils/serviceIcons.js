import {
    FiZap,
    FiDroplet,
    FiEdit,
    FiFilter,
    FiTool,
    FiRefreshCw
} from 'react-icons/fi';
import { FaFire, FaSeedling } from 'react-icons/fa';

export const serviceIcons = {
    electrical: FiZap,
    plumbing: FiDroplet,
    painting: FiEdit,
    waterPurifier: FiFilter,
    dismantling: FiTool,
    cleaning: FiRefreshCw,
    gardening: FaSeedling,
    gas: FaFire
};

export const getServiceIcon = (categoryId) => {
    return serviceIcons[categoryId] || FiTool;
};
