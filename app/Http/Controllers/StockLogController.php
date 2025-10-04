<?php

namespace App\Http\Controllers;

use App\Models\StockLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockLogController extends Controller
{
    public function index(Request $request)
    {
        $query = StockLog::with(['product', 'user']);

        if ($request->product_id) {
            $query->where('product_id', $request->product_id);
        }

        if ($request->type) {
            $query->where('type', $request->type);
        }

        if ($request->date_from) {
            $query->whereDate('logged_at', '>=', $request->date_from);
        }

        if ($request->date_to) {
            $query->whereDate('logged_at', '<=', $request->date_to);
        }

        $stockLogs = $query->latest('logged_at')->paginate(20)->withQueryString();

        return Inertia::render('StockLogs/Index', [
            'stockLogs' => $stockLogs,
            'filters' => $request->only(['product_id', 'type', 'date_from', 'date_to']),
        ]);
    }
}