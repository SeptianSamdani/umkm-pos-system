export default function Card({ title, children, action }) {
    return (
        <div className="rounded-lg bg-white p-6 shadow">
            {(title || action) && (
                <div className="mb-4 flex items-center justify-between">
                    {title && <h3 className="text-lg font-semibold">{title}</h3>}
                    {action && <div>{action}</div>}
                </div>
            )}
            {children}
        </div>
    );
}