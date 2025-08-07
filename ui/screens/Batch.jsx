const { containerVariants, itemVariants, cardVariants } = require("../animation/ContainerVariants")
const { BatchCard } = require("../component/card/BatchCard")
import { motion } from 'framer-motion';
import { DockIcon, ListCheck, SquareEqualIcon, Video, Users, Calendar } from 'lucide-react';

const BatchScreen = () => {

    const quickActions = [
        { title: 'Routine', icon: Users, color: 'bg-blue-500', href: '/students' },
        { title: 'Result', icon: ListCheck, color: 'bg-green-500', href: '/batch' },
        { title: 'Archive', icon: Calendar, color: 'bg-purple-500', href: '/exam' },
        { title: 'Merit List', icon: SquareEqualIcon, color: 'bg-yellow-500', href: '/attendance' },
        { title: 'Related Video', icon: Video, color: 'bg-red-500', href: '/assignments' },
        { title: 'Related PDF', icon: DockIcon, color: 'bg-indigo-500', href: '/exams' }
    ];
    
    return (
        <motion.div 
        className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8 md:mt-10 lg:mt-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        >

            <BatchCard
              key={1}
              batchName={"Fcps Crach Batch"}
              batchId={2}
              totalExam={12}
              givenExam={5}
              onClick={() => {}}/>

            <motion.div variants={itemVariants} className="">
                        <h2 className="text-gray-900 text-xl md:text-xl font-semibold mb-4 md:mb-6 font-geist-sans mt-2">
                          Study Section
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 md:gap-4">
                          {quickActions.map((action, index) => (
                            <motion.a
                              href={action.href}
                              key={action.title}
                              variants={cardVariants}
                              whileHover="hover"
                              whileTap={{ scale: 0.95 }}
                              className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 md:p-6 cursor-pointer group"
                            >
                              <div className="text-center">
                                <div className={`${action.color} rounded-lg p-3 md:p-4 mx-auto w-fit mb-3`}>
                                  <action.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                </div>
                                <p className="text-xs md:text-sm font-medium text-gray-900 group-hover:text-gray-700">
                                  {action.title}
                                </p>
                              </div>
                            </motion.a>
                          ))}
                        </div>
                      </motion.div>
            
        </motion.div>
    )
}

export default BatchScreen;