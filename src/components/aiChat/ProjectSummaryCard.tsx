import React from 'react';
import { BarChart3, CheckCircle2, Clock, HelpCircle, Lightbulb, Sparkles } from 'lucide-react';
import { ProjectSummary } from '../../store/aiChatStore';
import styles from './ProjectSummaryCard.module.css';

interface ProjectSummaryCardProps {
    summary: ProjectSummary;
}

const ProjectSummaryCard: React.FC<ProjectSummaryCardProps> = ({ summary }) => {
    const { totalTasks, todoCount, inProgressCount, doneCount, completedPercent } = summary;

    // SVG Donut Chart Calculation
    const radius = 38;
    const circumference = 2 * Math.PI * radius; // ≈ 238.76

    const todoPerc = totalTasks > 0 ? todoCount / totalTasks : 0;
    const inProgressPerc = totalTasks > 0 ? inProgressCount / totalTasks : 0;
    const donePerc = totalTasks > 0 ? doneCount / totalTasks : 0;

    const todoStroke = todoPerc * circumference;
    const inProgressStroke = inProgressPerc * circumference;
    const doneStroke = donePerc * circumference;

    const doneOffset = 0;
    const inProgressOffset = -doneStroke;
    const todoOffset = -(doneStroke + inProgressStroke);

    const COLOR_TODO = '#8b5cf6';       // --color-violet
    const COLOR_IN_PROGRESS = '#3b82f6';// --color-blue
    const COLOR_DONE = '#008000';       // --color-green

    return (
        <div className={styles.summaryCard}>
            {/* Header: Title and Badge split cleanly */}
            <div className={styles.summaryHeader}>
                <div className={styles.summaryTitle}>
                    <BarChart3 size={18} className={styles.titleIcon} />
                    <h4>Project Analytics</h4>
                </div>
                <div className={styles.completionBadge}>
                    <Sparkles size={13} />
                    <span>{completedPercent}% Done</span>
                </div>
            </div>

            {/* Chart Section: Diagram Top, Legend Bottom */}
            <div className={styles.chartSection}>
                <div className={styles.donutWrapper}>
                    <svg viewBox="0 0 100 100" className={styles.donutSvg}>
                        {/* Completed Segment */}
                        <circle
                            cx="50" cy="50" r={radius}
                            fill="transparent"
                            stroke={COLOR_DONE}
                            strokeWidth="11"
                            strokeDasharray={`${doneStroke} ${circumference}`}
                            strokeDashoffset={doneOffset}
                        />
                        {/* In Progress Segment */}
                        <circle
                            cx="50" cy="50" r={radius}
                            fill="transparent"
                            stroke={COLOR_IN_PROGRESS}
                            strokeWidth="11"
                            strokeDasharray={`${inProgressStroke} ${circumference}`}
                            strokeDashoffset={inProgressOffset}
                        />
                        {/* To Do Segment */}
                        <circle
                            cx="50" cy="50" r={radius}
                            fill="transparent"
                            stroke={COLOR_TODO}
                            strokeWidth="11"
                            strokeDasharray={`${todoStroke} ${circumference}`}
                            strokeDashoffset={todoOffset}
                        />
                    </svg>
                    <div className={styles.donutCenter}>
                        <span className={styles.donutValue}>{totalTasks}</span>
                        <span className={styles.donutLabel}>Total Tasks</span>
                    </div>
                </div>

                {/* Vertical Legend Below Chart */}
                <div className={styles.chartLegend}>
                    <div className={styles.legendItem}>
                        <div className={styles.legendLeft}>
                            <span className={styles.legendDot} style={{ backgroundColor: COLOR_TODO }} />
                            <HelpCircle size={14} className={styles.legendIcon} />
                            <span className={styles.legendText}>To Do</span>
                        </div>
                        <strong className={styles.legendCount}>{todoCount}</strong>
                    </div>

                    <div className={styles.legendItem}>
                        <div className={styles.legendLeft}>
                            <span className={styles.legendDot} style={{ backgroundColor: COLOR_IN_PROGRESS }} />
                            <Clock size={14} className={styles.legendIcon} />
                            <span className={styles.legendText}>In Progress</span>
                        </div>
                        <strong className={styles.legendCount}>{inProgressCount}</strong>
                    </div>

                    <div className={styles.legendItem}>
                        <div className={styles.legendLeft}>
                            <span className={styles.legendDot} style={{ backgroundColor: COLOR_DONE }} />
                            <CheckCircle2 size={14} className={styles.legendIcon} />
                            <span className={styles.legendText}>Completed</span>
                        </div>
                        <strong className={styles.legendCount}>{doneCount}</strong>
                    </div>
                </div>
            </div>

            {/* Attention Tasks */}
            {summary.attentionTasks && summary.attentionTasks.filter(t => t?.title).length > 0 && (
                <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
                    <h4 className="flex items-center gap-2 font-medium text-amber-900">
                        ⚠️ Tasks Requiring Attention
                    </h4>
                    <div className="mt-2 flex flex-col gap-1.5">
                        {summary.attentionTasks.filter(t => t?.title).map((task, index) => (
                            <div key={task.id || index} className="flex items-start gap-2 text-sm text-amber-800">
                                <span>📌</span>
                                <div className="flex flex-col">
                                    <span className="font-medium">{task.title}</span>
                                    {task.reason && (
                                        <span className="text-xs text-amber-600/80">{task.reason}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recommendations */}
            {summary.recommendations && summary.recommendations.length > 0 && (
                <div className={styles.recommendationBox}>
                    <div className={styles.sectionHeader}>
                        <Lightbulb size={15} className={styles.lightbulbIcon} />
                        <span>Recommendations</span>
                    </div>
                    <ul className={styles.bulletList}>
                        {summary.recommendations.map((rec, index) => (
                            <li key={index} className={styles.bulletItem}>
                                <span className={styles.bulletDot}>💡</span>
                                <span>{rec}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ProjectSummaryCard;