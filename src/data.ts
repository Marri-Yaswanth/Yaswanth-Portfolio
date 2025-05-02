import { Project, Skill, Certification, SocialLink, NavLink } from './types';

// Navigation links
export const navLinks: NavLink[] = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Education', href: '#education' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Certifications', href: '#certifications' },
  { name: 'Contact', href: '#contact' },
];

// Social Links - update these with your actual links
export const socialLinks: SocialLink[] = [
  { name: 'GitHub', url: 'https://github.com/', icon: 'Github' },
  { name: 'LinkedIn', url: 'https://linkedin.com/in/', icon: 'Linkedin' },
  { name: 'Email', url: 'mailto:your.email@example.com', icon: 'Mail' },
];

// About Me data
export const aboutMe = {
  name: 'Marri Venkata Siva Naga Yaswanth',
  title: 'Crafting Digital Experiences Through Code',
  introduction: 'I am a passionate and results-driven Full-Stack Web Developer with a knack for building dynamic, scalable, and user-focused web applications. I specialize in both front-end and back-end development, ensuring smooth user experiences and robust functionality across the stack.',
  detailedBio: `I believe in continuous learning and using the latest technologies to craft efficient and scalable solutions. My journey in software development began with curiosity and a strong desire to build something meaningful — from my early experiments with code to full-fledged web applications today. Over time, I've grown into a developer who enjoys working across the stack, solving complex problems, and bringing ideas to life.

When I'm not coding, you'll find me learning new tech stacks, brainstorming personal projects, or collaborating with like-minded developers. I enjoy diving into real-world challenges, whether it's through hackathons, tech meetups, or hands-on project building. For me, technology is more than just code — it's a way to create impact..

When I'm not coding, you can find me exploring the outdoors, reading about new technologies, or participating in hackathons to challenge myself and collaborate with other talented developers.`,
  photoUrl: '/portfolio-picture.jpeg',
  resumeLinks: {
    general: '/cv/general-resume.pdf',
    specialized: '/cv/specialized-resume.pdf'
  }
};

// Skills data
export const skills: Skill[] = [
  // Frontend
  { name: 'JavaScript', proficiency: 90, category: 'frontend', icon: 'FileCode' },
  { name: 'TypeScript', proficiency: 85, category: 'frontend', icon: 'FileCode' },
  { name: 'React', proficiency: 88, category: 'frontend', icon: 'Code' },
  { name: 'HTML/CSS', proficiency: 92, category: 'frontend', icon: 'Layout' },
  { name: 'Tailwind CSS', proficiency: 90, category: 'frontend', icon: 'Wind' },

  // Backend
  { name: 'Node.js', proficiency: 82, category: 'backend', icon: 'Server' },
  { name: 'Express', proficiency: 80, category: 'backend', icon: 'Server' },
  { name: 'MongoDB', proficiency: 75, category: 'backend', icon: 'Database' },
  { name: 'SQL', proficiency: 70, category: 'backend', icon: 'Database' },

  // Tools
  { name: 'Git', proficiency: 85, category: 'tools', icon: 'Git' },
  { name: 'Docker', proficiency: 65, category: 'tools', icon: 'Box' },
  { name: 'VS Code', proficiency: 90, category: 'tools', icon: 'Code2' },

  // Languages
  { name: 'Python', proficiency: 80, category: 'languages', icon: 'FileCode' },
  { name: 'Java', proficiency: 75, category: 'languages', icon: 'FileCode' },
  { name: 'C++', proficiency: 60, category: 'languages', icon: 'FileCode' },
];

// Projects data
export const projects: Project[] = [
  {
    id: 'project1',
    title: 'Recipe Sharing Platform',
    description: 'A dynamic React-based Recipe Sharing Platform that allows users to create, share, favorite, and explore recipes with advanced features like search, categorization, and social interactions.',
    technologies: ['React', 'Node.js', 'PHP'],
    image: '/projects/recipe-react/recipe-react.png',
    github: 'https://github.com/Yaswanth-Marri/recipe-react',
    // link: 'https://project1-demo.example.com'
  },
  {
    id: 'project2',
    title: 'Online Courses Project',
    description: 'A responsive Frontend Online Courses Platform built with modern web technologies, enabling users to browse, enroll, and interact with a wide range of courses seamlessly.',
    technologies: ['Angular','Node.js'],
    image: '/projects/online courses project/online courses project.png',
    github: 'https://github.com/Yaswanth-Marri/Online-Courses-Project'
  },
  {
    id: 'project3',
    title: 'Recipe share PHP',
    description: 'A PHP-powered backend for a Recipe Sharing Platform that manages user accounts, recipe submissions, favorites, likes, and search functionalities efficiently.',
    technologies: ['PHP','MySQL'],
    image: '/projects/recipe-share/recipeshare.png',
    github: 'https://github.com/Yaswanth-Marri/recipe-share',
    // link: 'https://project3-demo.example.com'
  },
  // {
  //   id: 'project4',
  //   title: 'AR Navigation for Campus',
  //   description: 'An augmented reality application to help students navigate university campuses and find resources.',
  //   technologies: ['React Native', 'ARKit', 'ARCore', 'Node.js'],
  //   image: '/projects/ar-navigation.png',
  //   github: 'https://github.com/username/project4'
  // },
];

// Certifications data
export const certifications: Certification[] = [
  {
    id: 'cert1',
    name: 'DevOps Certificate',
    issuer: 'DevOps Institute',
    date: '2024-02-24',
    credentialLink: '/certificates/DevOps certicate.pdf',
    image: '/certificates/Devopsgfg.webp'
  },
  {
    id: 'cert2',
    name: 'Cloud Computing Certificate',
    issuer: 'Cloud Computing Institute',
    date: '2023-11-30',
    credentialLink: '/certificates/cloudcomputing.pdf',
    image: '/certificates/cloud.jpeg'
  },
  // {
  //   id: 'cert3',
  //   name: 'TensorFlow Developer Certificate',
  //   issuer: 'Google',
  //   date: '2023-05-10',
  //   credentialLink: 'https://www.example.com/verify/cert3',
  //   image: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  // },
  // {
  //   id: 'cert4',
  //   name: 'Full Stack Web Development',
  //   issuer: 'Udacity',
  //   date: '2022-12-05',
  //   credentialLink: 'https://www.example.com/verify/cert4',
  //   image: 'https://images.pexels.com/photos/4974915/pexels-photo-4974915.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  // },
];